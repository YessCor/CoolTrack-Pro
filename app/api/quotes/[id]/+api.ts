import { createErrorResponse, createSuccessResponse } from '@/lib/api';
import sql from '@/lib/db';
import { enhanceQuote } from '@/lib/quote-utils';

export async function GET(request: Request, ctx?: any) {
  try {
    const url = new URL(request.url);
    // Extraer el id del path: /api/quotes/<id>
    const id = (ctx?.params?.id) ?? url.pathname.split('/').filter(Boolean).pop();
    const user_id = url.searchParams.get('user_id');
    const role = url.searchParams.get('role');
    
    if (!user_id || !role) {
      return createErrorResponse('Unauthorized', 401);
    }

    const quoteResult = await sql`
      SELECT q.*, 
             u_client.name as client_name, 
             u_tech.name as technician_name
      FROM quotes q
      JOIN users u_client ON q.client_id = u_client.id
      LEFT JOIN users u_tech ON q.technician_id = u_tech.id
      WHERE q.id = ${id}::uuid
    `;

    if (quoteResult.length === 0) {
      return createErrorResponse('Cotización no encontrada', 404);
    }

    const quote = quoteResult[0];

    // Validar permisos: cliente solo ve sus cotizaciones, técnico solo las suyas, admin ve todas
    if (role === 'client' && quote.client_id !== user_id) {
      return createErrorResponse('No tienes permiso para ver esta cotización', 403);
    }
    if (role === 'technician' && quote.technician_id !== user_id) {
      return createErrorResponse('No tienes permiso para ver esta cotización', 403);
    }

    const items = await sql`
      SELECT * FROM quote_items WHERE quote_id = ${id}::uuid ORDER BY created_at ASC
    `;

    // IMMUTABLE ENHANCEMENT
    const enhancedQuote = enhanceQuote(quote as any);

    return createSuccessResponse({ quote: enhancedQuote, items });
  } catch (error: any) {
    console.error('[GET /api/quotes/[id]] FATAL ERROR:', error.message);
    return createErrorResponse('Error al obtener detalle', 500);
  }
}

export async function PATCH(request: Request, ctx?: any) {
  try {
    const url = new URL(request.url);
    const id = (ctx?.params?.id) ?? url.pathname.split('/').filter(Boolean).pop();
    const user_id = url.searchParams.get('user_id');
    const role = url.searchParams.get('role');
    
    if (!user_id || !role) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { status } = await request.json();
    const validStatuses = ['draft', 'sent', 'approved', 'rejected', 'expired'];

    if (!status || !validStatuses.includes(status)) {
      return createErrorResponse('Estado inválido', 400);
    }

    const updated = await sql`
      UPDATE quotes 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}::uuid
      RETURNING *;
    `;

    if (updated.length === 0) {
      return createErrorResponse('Cotización no encontrada', 404);
    }

    // IMMUTABLE ENHANCEMENT
    const enhancedQuote = enhanceQuote(updated[0] as any);

    return createSuccessResponse({ quote: enhancedQuote });
  } catch (error: any) {
    console.error('[PATCH /api/quotes/[id]] FATAL ERROR:', error.message);
    return createErrorResponse('Error al actualizar estado', 500);
  }
}
