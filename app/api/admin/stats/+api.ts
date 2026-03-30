import sql from '@/lib/db';
import { ORDER_STATUS } from '@/lib/order-status';

export async function GET(request: Request) {
  try {
    // 1. Órdenes asignadas hoy (o activos)
    const assigned = await sql`
      SELECT count(*) as count FROM service_orders 
      WHERE status IN (
        ${ORDER_STATUS.ASSIGNED}, 
        ${ORDER_STATUS.ACCEPTED}, 
        ${ORDER_STATUS.IN_TRANSIT}, 
        ${ORDER_STATUS.IN_PROGRESS}
      )
    `;

    // 2. Órdenes completadas hoy
    const completed = await sql`
      SELECT count(*) as count FROM service_orders 
      WHERE status = ${ORDER_STATUS.COMPLETED} AND updated_at::date = CURRENT_DATE
    `;

    // 3. Alertas (Por ahora mockeamos una lógica de ejemplo: órdenes sin técnico asignado)
    const alerts = await sql`
      SELECT count(*) as count FROM service_orders 
      WHERE status = ${ORDER_STATUS.PENDING} AND created_at < NOW() - INTERVAL '2 hours'
    `;

    return Response.json({
      success: true,
      stats: {
        assigned: parseInt(assigned[0].count),
        completed: parseInt(completed[0].count),
        alerts: parseInt(alerts[0].count)
      }
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return Response.json({ success: false, error: 'Error al obtener métricas' }, { status: 500 });
  }
}
