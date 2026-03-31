import sql from '@/lib/db';
import { createSuccessResponse, createErrorResponse } from '@/lib/api';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');
    const role = url.searchParams.get('role');
    const client_id = url.searchParams.get('client_id');

    if (!userId || !role) {
      return createErrorResponse('user_id y role son requeridos', 400);
    }

    if (role !== 'admin') {
      return createErrorResponse('Solo admins pueden ver equipos', 403);
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (client_id && !uuidRegex.test(client_id)) {
      return createErrorResponse('client_id debe ser un UUID válido', 400);
    }

    let query;
    if (client_id) {
      query = await sql`
        SELECT 
          e.*,
          u.name as client_name,
          u.email as client_email,
          u.phone as client_phone,
          u.address as client_address,
          COALESCE(
            (SELECT json_agg(json_build_object(
              'id', o.id,
              'order_number', o.order_number,
              'status', o.status,
              'service_type', o.service_type,
              'description', o.description,
              'technician_name', t.name,
              'created_at', o.created_at,
              'completed_at', o.completed_at
            ) ORDER BY o.created_at DESC)
            FROM service_orders o
            LEFT JOIN users t ON o.technician_id = t.id
            WHERE o.equipment_id = e.id
            ),
            '[]'::json
          ) as service_history
        FROM equipment e
        JOIN users u ON e.client_id = u.id
        WHERE e.client_id = ${client_id}::uuid
        ORDER BY e.created_at DESC
      `;
    } else {
      query = await sql`
        SELECT 
          e.*,
          u.name as client_name,
          u.email as client_email,
          COUNT(o.id) as service_count,
          MAX(o.created_at) as last_service
        FROM equipment e
        JOIN users u ON e.client_id = u.id
        LEFT JOIN service_orders o ON o.equipment_id = e.id
        GROUP BY e.id, u.id
        ORDER BY e.created_at DESC
      `;
    }

    return createSuccessResponse({ equipment: query });
  } catch (error: any) {
    console.error('[GET /api/admin/equipment]', error.message);
    return createErrorResponse('Error al obtener equipos', 500);
  }
}
