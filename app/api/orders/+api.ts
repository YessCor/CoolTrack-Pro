import sql from '@/lib/db';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const user_id = url.searchParams.get('user_id');
  const role = url.searchParams.get('role');

  if (!user_id || !role) {
    return Response.json({ success: false, error: 'User ID y Role requeridos' }, { status: 400 });
  }

  try {
    let orders;
    const lowerRole = role.toLowerCase();

    if (lowerRole === 'admin') {
      orders = await sql`
        SELECT o.*, u.name as client_name, t.name as technician_name 
        FROM service_orders o
        JOIN users u ON o.client_id = u.id
        LEFT JOIN users t ON o.technician_id = t.id
        ORDER BY o.created_at DESC
      `;
    } else if (lowerRole === 'technician') {
      orders = await sql`
        SELECT o.*, u.name as client_name 
        FROM service_orders o
        JOIN users u ON o.client_id = u.id
        WHERE o.technician_id = ${user_id}
        ORDER BY o.created_at DESC
      `;
    } else {
      orders = await sql`
        SELECT o.*, t.name as technician_name 
        FROM service_orders o
        LEFT JOIN users t ON o.technician_id = t.id
        WHERE o.client_id = ${user_id}
        ORDER BY o.created_at DESC
      `;
    }

    return Response.json({ success: true, orders });
  } catch (error: any) {
    console.error('Fetch orders error:', error);
    return Response.json({ success: false, error: 'Error al obtener órdenes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const updateId = url.searchParams.get('id');
    const body = await request.json();

    // ESCENARIO A: ACTUALIZACIÓN (Si hay ID)
    if (updateId) {
      const { status, notes } = body;
      if (!status) {
        return Response.json({ success: false, error: 'Status es obligatorio para actualizar' }, { status: 400 });
      }

      console.log(`[API-UPDATE] Actualizando orden ${updateId} a ${status}`);
      const updated = await sql`
        UPDATE service_orders 
        SET status = ${status}::order_status, 
            technician_notes = ${notes || null},
            updated_at = NOW()
        WHERE id = ${updateId}::uuid
        RETURNING *;
      `;

      if (updated.length === 0) {
        return Response.json({ success: false, error: 'Orden no encontrada' }, { status: 404 });
      }
      return Response.json({ success: true, order: updated[0] });
    }

    // ESCENARIO B: CREACIÓN (Si no hay ID)
    const { 
      client_id, 
      equipment_id, 
      service_type, 
      description, 
      address, 
      priority 
    } = body;

    if (!client_id || !description || !address) {
      return Response.json({ success: false, error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const newOrder = await sql`
      INSERT INTO service_orders (client_id, equipment_id, service_type, description, address, priority, status)
      VALUES (${client_id}, ${equipment_id || null}, ${service_type || 'General'}, ${description}, ${address}, ${priority || 'medium'}, 'pending')
      RETURNING *;
    `;

    return Response.json({ success: true, order: newOrder[0] });
  } catch (error: any) {
    console.error('SERVER ERROR IN /api/orders:', error);
    return Response.json({ 
      success: false, 
      error: 'Fallo procesando la orden en el servidor.',
      debug: error.message 
    }, { status: 500 });
  }
}
