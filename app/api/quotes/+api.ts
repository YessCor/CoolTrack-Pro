
import sql from '@/lib/db';
import type { Quote } from '@/lib/types';
import { createErrorResponse, createSuccessResponse } from '@/lib/api';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const user_id = url.searchParams.get('user_id');
    const role = url.searchParams.get('role')?.toLowerCase();
    
    if (!user_id || !role) {
      return createErrorResponse('user_id y role son requeridos', 401);
    }

    let query;
    if (role === 'admin') {
      query = await sql`SELECT * FROM quotes ORDER BY created_at DESC`;
    } else if (role === 'technician') {
      query = await sql`SELECT * FROM quotes WHERE technician_id = ${user_id} ORDER BY created_at DESC`;
    } else {
      query = await sql`SELECT * FROM quotes WHERE client_id = ${user_id} ORDER BY created_at DESC`;
    }

    return createSuccessResponse({ data: query as Quote[] });
  } catch (error) {
    console.error('[GET /api/quotes] Fatal Error:', error);
    return createErrorResponse('No se pudieron obtener las cotizaciones', 500);
  }
}

export async function POST(request: Request) {
  console.log('[POST /api/quotes] --- INICIO DE PETICIÓN ---');
  try {
    const url = new URL(request.url);
    const user_id = url.searchParams.get('user_id');
    const role = url.searchParams.get('role')?.toLowerCase();
    
    console.log(`[POST /api/quotes] Auth context: user_id=${user_id}, role=${role}`);

    if (!user_id || role !== 'technician') {
      console.log('[POST /api/quotes] Error: Unauthorized/Not technician');
      return createErrorResponse('Solo los técnicos pueden generar cotizaciones', 401);
    }

    const body = await request.json();
    console.log('[POST /api/quotes] Received body:', JSON.stringify(body, null, 2));

    const { order_id, client_id, items, notes, valid_until } = body;

    if (!client_id || !items || !Array.isArray(items) || items.length === 0) {
      console.log('[POST /api/quotes] Error: Missing required fields or empty items');
      return createErrorResponse('Faltan campos obligatorios o la lista de ítems está vacía', 400);
    }

    // Calcular montos
    const subtotal = items.reduce((sum: number, item: any) => sum + (Number(item.total) || 0), 0);
    const tax_rate = 0.16; 
    const taxAmount = subtotal * tax_rate;
    const total = subtotal + taxAmount;
    const quoteNumber = `COT-${Date.now().toString().slice(-6)}`;

    console.log(`[POST /api/quotes] Calculated: subtotal=${subtotal}, tax=${taxAmount}, total=${total}`);

    // Transacción: Insertar Cotización
    console.log('[POST /api/quotes] Inserting quote record...');
    const result = await sql`
      INSERT INTO quotes (
        quote_number, order_id, client_id, technician_id, 
        status, subtotal, tax_rate, tax_amount, total, 
        valid_until, notes
      ) VALUES (
        ${quoteNumber}, ${order_id || null}, ${client_id}, ${user_id}, 
        'sent', ${subtotal}, ${tax_rate}, ${taxAmount}, ${total}, 
        ${valid_until || null}, ${notes || null}
      ) RETURNING *;
    `;

    if (result.length === 0) {
      throw new Error('Database INSERT for quote header returned 0 results');
    }

    const quoteId = result[0].id;
    console.log(`[POST /api/quotes] Quote created ID=${quoteId}. Inserting items...`);

    // Insertar ítems
    for (const item of items) {
      await sql`
        INSERT INTO quote_items (
          quote_id, description, quantity, unit_price, total
        ) VALUES (
          ${quoteId}, ${item.description}, ${item.quantity || 1}, ${item.unit_price}, ${item.total}
        );
      `;
    }

    console.log('[POST /api/quotes] Quote items inserted successfully.');
    return createSuccessResponse({ data: result[0] as Quote });

  } catch (error: any) {
    console.error('[POST /api/quotes] FATAL ERROR:', error);
    return createErrorResponse(
      'Error interno al crear la cotización', 
      500, 
      { message: error.message, stack: error.stack?.split('\n').slice(0, 3) }
    );
  }
}
