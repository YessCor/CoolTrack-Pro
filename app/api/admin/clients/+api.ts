
import { getServerSession } from 'next-auth/next'
import { authConfig } from '@/lib/auth-config'
import sql from '@/lib/db'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user || session.user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
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

    return Response.json({ success: true, clients })
  } catch (error) {
    console.error('Error fetching clients:', error)
    return Response.json(
      { success: false, error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}
