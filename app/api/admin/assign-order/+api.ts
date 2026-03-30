import sql from '@/lib/db';
import { createErrorResponse, createSuccessResponse } from '@/lib/api';

export async function PATCH(request: Request) {
  try {
    const { order_id, technician_id } = await request.json();

    if (!order_id || !technician_id) {
      return createErrorResponse('Order ID y Technician ID requeridos', 400);
    }

    const updatedOrder = await sql`
      UPDATE service_orders 
      SET technician_id = ${technician_id}::uuid, 
          status = 'assigned', 
          updated_at = NOW()
      WHERE id = ${order_id}::uuid
      RETURNING *;
    `;

    if (updatedOrder.length === 0) {
      return createErrorResponse('Orden no encontrada o ID inválido', 404);
    }

    return createSuccessResponse({ order: updatedOrder[0] });

  } catch (error: any) {
    console.error('[PATCH /api/admin/assign-order]', error.message);
    return createErrorResponse('Error al asignar técnico', 500);
  }
}
