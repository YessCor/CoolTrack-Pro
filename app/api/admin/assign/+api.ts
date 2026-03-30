import sql from '@/lib/db';
import { ORDER_STATUS } from '@/lib/order-status';

export async function POST(request: Request) {
  try {
    const { order_id, technician_id } = await request.json();

    if (!order_id || !technician_id) {
      return Response.json({ success: false, error: 'Order ID y Technician ID requeridos' }, { status: 400 });
    }

    const updatedOrder = await sql`
      UPDATE service_orders 
      SET technician_id = ${technician_id}, 
          status = ${ORDER_STATUS.ASSIGNED}::order_status, 
          updated_at = NOW()
      WHERE id = ${order_id}
      RETURNING *;
    `;

    if (updatedOrder.length === 0) {
      return Response.json({ success: false, error: 'Orden no encontrada o ID inválido' }, { status: 404 });
    }

    return Response.json({ success: true, order: updatedOrder[0] });
  } catch (error: any) {
    console.error('[POST /api/admin/assign]', error.message);
    return Response.json({ success: false, error: 'Error al asignar técnico' }, { status: 500 });
  }
}
