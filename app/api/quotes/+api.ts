import sql from '@/lib/db';
import type { Quote } from '@/lib/types';
import { createErrorResponse, createSuccessResponse } from '@/lib/api';
import { formatQuoteNumber, enhanceQuote } from '@/lib/quote-utils';

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
      query = await sql`SELECT * FROM quotes WHERE technician_id = ${user_id}::uuid ORDER BY created_at DESC`;
    } else {
      query = await sql`SELECT * FROM quotes WHERE client_id = ${user_id}::uuid ORDER BY created_at DESC`;
    }

    // Mapear cada cotización para incluir el campo calculado display_quote_number
    const enhancedQuotes = query.map(q => enhanceQuote(q as any));

    return createSuccessResponse({ data: enhancedQuotes });
  } catch (error) {
    console.error('[GET /api/quotes] Fatal Error:', error);
    return createErrorResponse('No se pudieron obtener las cotizaciones', 500);
  }
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const user_id = url.searchParams.get('user_id');
    const role = url.searchParams.get('role')?.toLowerCase();
    
    if (!user_id || role !== 'technician') {
      return createErrorResponse('Solo los técnicos pueden generar cotizaciones', 401);
    }

    const body = await request.json();
    
    const { order_id, client_id, items, notes, valid_until } = body;

    if (!client_id || !items || !Array.isArray(items) || items.length === 0) {
      return createErrorResponse('Faltan campos obligatorios o la lista de ítems está vacía', 400);
    }

    const cleanOrderId = (order_id && order_id.trim() !== '') ? order_id : null;
    const subtotal = Number(items.reduce((sum: number, item: any) => sum + (Number(item.total) || 0), 0));
    const tax_rate = 0.16; 
    const taxAmount = Number((subtotal * tax_rate).toFixed(2));
    const total = Number((subtotal + taxAmount).toFixed(2));

    const result = await sql`
      INSERT INTO quotes (
        order_id, client_id, technician_id, 
        status, subtotal, tax_rate, tax_amount, total, 
        valid_until, notes
      ) VALUES (
        ${cleanOrderId}::uuid, 
        ${client_id}::uuid, 
        ${user_id}::uuid, 
        'sent', 
        ${subtotal}, 
        ${tax_rate}, 
        ${taxAmount}, 
        ${total}, 
        ${valid_until || null}, 
        ${notes || null}
      ) RETURNING *;
    `;

    if (result.length === 0) {
      throw new Error('Database INSERT for quote header returned 0 results');
    }

    const quoteId = result[0].id;

    for (const item of items) {
      await sql`
        INSERT INTO quote_items (
          quote_id, description, quantity, unit_price, total
        ) VALUES (
          ${quoteId}::uuid, ${item.description}, ${item.quantity || 1}, ${item.unit_price}, ${item.total}
        );
      `;
    }

    const enhancedQuote = enhanceQuote(result[0] as any);
    
    return createSuccessResponse({ data: enhancedQuote });

  } catch (error: any) {
    console.error('[POST /api/quotes] FATAL ERROR:', error.message);
    return createErrorResponse(
      'Error interno al crear la cotización', 
      500, 
      { message: error.message, detail: error.detail, code: error.code }
    );
  }
}
