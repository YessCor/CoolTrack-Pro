import sql from '@/lib/db';

export async function GET(request: Request, context: any) {
  try {
    const id = context?.params?.id;

    if (!id) {
      return Response.json({ success: false, error: 'ID requerido' }, { status: 400 });
    }

    const equipment = await sql`
      SELECT * FROM equipment WHERE id = ${id}
    `;

    if (equipment.length === 0) {
      return Response.json({ success: false, error: 'Equipo no encontrado' }, { status: 404 });
    }

    return Response.json({ success: true, equipment: equipment[0] });
  } catch (error: any) {
    console.error('[GET /api/equipment/[id]]', error.message);
    return Response.json({ success: false, error: 'Error al obtener equipo' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: any) {
  try {
    const id = context?.params?.id;

    if (!id) {
      return Response.json({ success: false, error: 'ID requerido' }, { status: 400 });
    }

    const {
      name,
      type,
      brand,
      model,
      serial_number,
      capacity_tons,
      installation_date,
      last_service_date,
      location_description,
      notes,
    } = await request.json();

    const updated = await sql`
      UPDATE equipment SET
        name = ${name ?? null},
        type = ${type ?? null},
        brand = ${brand ?? null},
        model = ${model ?? null},
        serial_number = ${serial_number ?? null},
        capacity_tons = ${capacity_tons ?? null},
        installation_date = ${installation_date ?? null},
        last_service_date = ${last_service_date ?? null},
        location_description = ${location_description ?? null},
        notes = ${notes ?? null},
        updated_at = NOW()
      WHERE id = ${id}::uuid
      RETURNING *
    `;

    if (updated.length === 0) {
      return Response.json({ success: false, error: 'Equipo no encontrado' }, { status: 404 });
    }

    return Response.json({ success: true, equipment: updated[0] });
  } catch (error: any) {
    console.error('[PUT /api/equipment/[id]]', error.message);
    return Response.json({ success: false, error: 'Error al actualizar equipo' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const id = context?.params?.id;

    if (!id) {
      return Response.json({ success: false, error: 'ID requerido' }, { status: 400 });
    }

    const deleted = await sql`
      DELETE FROM equipment WHERE id = ${id}::uuid RETURNING id
    `;

    if (deleted.length === 0) {
      return Response.json({ success: false, error: 'Equipo no encontrado' }, { status: 404 });
    }

    return Response.json({ success: true, message: 'Equipo eliminado' });
  } catch (error: any) {
    console.error('[DELETE /api/equipment/[id]]', error.message);
    return Response.json({ success: false, error: 'Error al eliminar equipo' }, { status: 500 });
  }
}
