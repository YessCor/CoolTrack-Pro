import sql from '@/lib/db';
import { ORDER_STATUS } from '@/lib/order-status';
import { createErrorResponse, createSuccessResponse } from '@/lib/api';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const user_id = url.searchParams.get('user_id');
    const role = url.searchParams.get('role')?.toLowerCase();
    
    if (!user_id || role !== 'admin') {
      return createErrorResponse('Unauthorized', 401);
    }

    // 1. Órdenes activas (asignadas, aceptadas, etc.)
    const assignedResult = await sql`
      SELECT count(*) as count FROM service_orders 
      WHERE status IN (
        'assigned', 'accepted', 'in_transit', 'in_progress'
      )
    `;

    // 2. Órdenes completadas hoy
    const completedResult = await sql`
      SELECT count(*) as count FROM service_orders 
      WHERE status = 'completed' AND updated_at::date = CURRENT_DATE
    `;

    // 3. Alertas (órdenes sin técnico asignado por más de 2 horas)
    const alertsResult = await sql`
      SELECT count(*) as count FROM service_orders 
      WHERE status = 'pending' AND created_at < NOW() - INTERVAL '2 hours'
    `;

    return createSuccessResponse({
      stats: {
        assigned: parseInt(assignedResult[0].count),
        completed: parseInt(completedResult[0].count),
        alerts: parseInt(alertsResult[0].count)
      }
    });

  } catch (error: any) {
    console.error('[ADMIN-STATS] FATAL ERROR:', error.message);
    return createErrorResponse('Error al obtener métricas', 500);
  }
}
