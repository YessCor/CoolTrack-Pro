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

    const orders = await sql`
      SELECT 
        o.id,
        o.service_type,
        o.status,
        o.description,
        o.client_id,
        o.technician_id,
        o.created_at,
        o.updated_at,
        o.completed_at,
        u.name as client_name,
        u.email as client_email,
        u.address,
        u.phone as client_phone,
        t.name as technician_name,
        t.email as technician_email
      FROM service_orders o
      JOIN users u ON o.client_id = u.id
      LEFT JOIN users t ON o.technician_id = t.id
      ORDER BY o.created_at DESC
    `;

    return createSuccessResponse({ orders });
  } catch (error: any) {
    console.error('[GET /api/admin/orders]', error.message);
    return createErrorResponse('Error al obtener órdenes', 500);
  }
}
