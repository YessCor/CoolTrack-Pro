
import { auth } from '@/lib/auth'
import sql from '@/lib/db'

export async function GET(request: Request) {
  try {
    let session;
    try {
      session = await auth()
    } catch (authError) {
      console.error('[GET /api/admin/clients] Auth error:', authError)
      return Response.json({ error: 'Authentication failed', detail: String(authError) }, { status: 500 })
    }

    console.log('[GET /api/admin/clients] Session:', JSON.stringify(session))

    if (!session?.user || session.user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[GET /api/admin/clients] Executing SQL query...')
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
    console.log('[GET /api/admin/clients] Query successful, clients count:', clients.length)

    return Response.json({ success: true, clients })
  } catch (error) {
    console.error('Error fetching clients:', error)
    return Response.json(
      { success: false, error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}
