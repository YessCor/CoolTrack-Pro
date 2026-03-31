import sql from '@/lib/db';
import { createSuccessResponse, createErrorResponse } from '@/lib/api';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');
    const role = url.searchParams.get('role');

    if (!userId || !role) {
      return createErrorResponse('user_id y role son requeridos', 400);
    }

    const quotes = await sql`
      SELECT 
        q.*,
        u.name as client_name,
        u.email as client_email
      FROM quotes q
      JOIN users u ON q.client_id = u.id
      ORDER BY q.created_at DESC
    `;

    return createSuccessResponse({ quotes });
  } catch (error: any) {
    console.error('[GET /api/admin/quotes]', error.message);
    return createErrorResponse('Error al obtener cotizaciones', 500);
  }
}
