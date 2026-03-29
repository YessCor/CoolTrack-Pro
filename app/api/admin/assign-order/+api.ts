import sql from '@/lib/db';

export async function PATCH(request: Request) {
  try {
  const { order_id, technician_id } = await request.json();
    
    console.log('DEBUG - Assigning Payload:', { order_id, technician_id });

    if (!order_id || !technician_id) {
      return Response.json({ success: false, error: 'Order ID y Technician ID requeridos' }, { status: 400 });
    }

    // Actualizar la orden con el técnico asignado
    const updatedOrder = await sql`
      UPDATE service_orders 
      SET technician_id = ${technician_id}, 
          status = 'assigned', 
          updated_at = NOW()
      WHERE id = ${order_id}
      RETURNING *;
    `;

    if (updatedOrder.length === 0) {
      return Response.json({ success: false, error: 'Orden no encontrada o ID inválido' }, { status: 404 });
    }

    return Response.json({ success: true, order: updatedOrder[0] });
  } catch (error: any) {
    console.error('Assign technician CRITICAL error:', {
      message: error.message,
      detail: error.detail,
      hint: error.hint
    });
    return Response.json({ 
      success: false, 
      error: 'Error de base de datos al asignar técnico.',
      debug: error.message 
    }, { status: 500 });
  }
}
