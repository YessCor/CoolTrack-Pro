import sql from '@/lib/db';

export async function GET(request: Request) {
  try {
    // 1. Órdenes asignadas hoy (o activos)
    const assigned = await sql`
      SELECT count(*) as count FROM service_orders 
      WHERE status IN ('assigned', 'accepted', 'on_the_way', 'on_site', 'in_progress')
    `;

    // 2. Órdenes completadas hoy
    const completed = await sql`
      SELECT count(*) as count FROM service_orders 
      WHERE status = 'completed' AND updated_at::date = CURRENT_DATE
    `;

    // 3. Alertas (Por ahora mockeamos una lógica de ejemplo: órdenes sin técnico asignado)
    const alerts = await sql`
      SELECT count(*) as count FROM service_orders 
      WHERE status = 'pending' AND created_at < NOW() - INTERVAL '2 hours'
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
