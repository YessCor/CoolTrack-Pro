import sql from '@/lib/db';

export async function GET(request: Request, context: any) {
  try {
    const id = context?.params?.id || new URL(request.url).pathname.split('/').pop();

    if (!id) {
       return Response.json({ success: false, error: 'ID no proporcionado' }, { status: 400 });
    }

    const order = await sql`
      SELECT o.*, u.name as client_name, u.phone as client_phone, t.name as technician_name 
      FROM service_orders o
      JOIN users u ON o.client_id = u.id
      LEFT JOIN users t ON o.technician_id = t.id
      WHERE o.id = ${id}
    `;

    if (order.length === 0) {
      return Response.json({ success: false, error: 'Orden no encontrada' }, { status: 404 });
    }

    // Obtener media asociada (fotos)
    const media = await sql`
      SELECT url, context, caption FROM media 
      WHERE order_id = ${id}
      ORDER BY created_at DESC
    `;

    return Response.json({ success: true, order: order[0], media });
  } catch (error: any) {
    console.error('Fetch order detail error:', error);
    return Response.json({ success: false, error: 'Error al obtener detalle' }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: any) {
  try {
    // 1. Extracción segura del ID (ignorando query params)
    const url = new URL(request.url);
    const idFromPath = url.pathname.split('/').filter(Boolean).pop();
    const id = (context?.params?.id || idFromPath || "").trim();

    // 2. Validación de cuerpo JSON
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return Response.json({ success: false, error: 'Cuerpo de petición inválido (No es JSON)' }, { status: 400 });
    }

    const { status, notes } = body;
    if (!status) {
      return Response.json({ success: false, error: 'El campo "status" es obligatorio' }, { status: 400 });
    }

    console.log(`[API] Intentando actualizar orden ${id} a estado: ${status}`);

    // 3. Actualización con casting de seguridad
    const updated = await sql`
      UPDATE service_orders 
      SET status = ${status}::order_status, 
          technician_notes = ${notes || null},
          updated_at = NOW()
      WHERE id = ${id}::uuid
      RETURNING *;
    `;

    if (!updated || updated.length === 0) {
      return Response.json({ success: false, error: 'No se encontró la orden técnica con ese ID' }, { status: 404 });
    }

    return Response.json({ success: true, order: updated[0] });
  } catch (error: any) {
    console.error('CRITICAL DATABASE ERROR:', error);
    return Response.json({ 
      success: false, 
      error: 'Fallo crítico en la actualización de la base de datos.',
      message: error.message,
      code: error.code // Ej: 42703 para columna inexistente
    }, { status: 500 });
  }
}
