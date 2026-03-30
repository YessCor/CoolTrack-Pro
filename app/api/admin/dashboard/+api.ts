import { auth } from '@/lib/auth'
import sql from '@/lib/db'
import { createSuccessResponse, createErrorResponse } from '@/lib/api'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return createErrorResponse('Unauthorized', 401)
    }

    const stats = await Promise.all([
      sql`SELECT COUNT(*) as count FROM service_orders`,
      sql`SELECT COUNT(*) as count FROM service_orders WHERE status IN ('assigned', 'accepted', 'in_transit', 'in_progress')`,
      sql`SELECT COUNT(*) as count FROM service_orders WHERE status = 'completed'`,
      sql`SELECT COUNT(*) as count FROM quotes WHERE status = 'draft'`,
      sql`SELECT COALESCE(SUM(total_amount), 0) as total FROM service_orders WHERE status = 'completed'`,
      sql`SELECT COALESCE(AVG(client_rating), 0) as avg FROM service_orders WHERE client_rating IS NOT NULL`,
      sql`SELECT COUNT(*) as count FROM users WHERE role = 'technician'`,
      sql`SELECT COUNT(*) as count FROM users WHERE role = 'client'`,
    ])

    return createSuccessResponse({
      totalOrders: stats[0][0].count,
      activeOrders: stats[1][0].count,
      completedOrders: stats[2][0].count,
      pendingQuotes: stats[3][0].count,
      totalRevenue: parseFloat(stats[4][0].total),
      averageRating: parseFloat(stats[5][0].avg),
      totalTechnicians: stats[6][0].count,
      totalClients: stats[7][0].count,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return createErrorResponse('Failed to fetch dashboard stats')
  }
}
