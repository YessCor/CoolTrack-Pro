
import sql from '@/lib/db'
import { createSuccessResponse, createErrorResponse } from '@/lib/api'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('user_id')
    const role = url.searchParams.get('role')

    if (!userId || !role) {
      return createErrorResponse('user_id y role son requeridos', 400)
    }

    if (role !== 'admin') {
      return createErrorResponse('Solo admins pueden ver clientes', 403)
    }

    const clients = await sql`
      SELECT 
        u.id, u.email, u.name, u.phone, u.address, u.is_active, u.created_at,
        COUNT(e.id) as equipment_count,
        COALESCE(
          (SELECT json_agg(DISTINCT eq.type) FROM equipment eq WHERE eq.client_id = u.id),
          '[]'::json
        ) as equipment_types,
        COUNT(CASE WHEN o.status IN ('pending', 'assigned', 'accepted', 'in_transit', 'in_progress') THEN 1 END) as pending_orders
      FROM users u
      LEFT JOIN equipment e ON u.id = e.client_id
      LEFT JOIN service_orders o ON u.id = o.client_id
      WHERE u.role = 'client'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `

    return createSuccessResponse({ clients })
  } catch (error: any) {
    console.error('[GET /api/admin/clients]', error.message)
    return createErrorResponse('Error al obtener clientes', 500)
  }
}
