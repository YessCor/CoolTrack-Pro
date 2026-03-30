import sql from '@/lib/db';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const client_id = url.searchParams.get('client_id');
  const admin_view = url.searchParams.get('admin_view');

  try {
    if (admin_view === 'true') {
      const equipments = await sql`
        SELECT e.*, u.name as client_name, u.email as client_email 
        FROM equipment e
        JOIN users u ON e.client_id = u.id
        ORDER BY e.created_at DESC
      `;
      return Response.json({ success: true, equipments });
    }

    if (!client_id) {
      return Response.json({ success: false, error: 'Client ID requerido' }, { status: 400 });
    }

    const equipments = await sql`
      SELECT * FROM equipment 
      WHERE client_id = ${client_id}
      ORDER BY created_at DESC
    `;

    return Response.json({ success: true, equipments });
  } catch (error: any) {
    console.error('Fetch equipment error:', error);
    return Response.json({ success: false, error: 'Error al obtener equipos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { 
      client_id, 
      name,
      type, 
      brand, 
      model, 
      serial_number,
      capacity_tons,
      installation_date,
      location_description,
      notes,
    } = await request.json();

    if (!client_id || !type || !location_description) {
      return Response.json({ success: false, error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const newEquipment = await sql`
      INSERT INTO equipment (
        client_id, name, type, brand, model, serial_number, 
        capacity_tons, installation_date, location_description, notes
      )
      VALUES (
        ${client_id}::uuid, 
        ${name || null}, 
        ${type}, 
        ${brand || null}, 
        ${model || null}, 
        ${serial_number || null},
        ${capacity_tons || null},
        ${installation_date || null},
        ${location_description}, 
        ${notes || null}
      )
      RETURNING *
    `;

    return Response.json({ success: true, equipment: newEquipment[0] });
  } catch (error: any) {
    console.error('Create equipment error:', error);
    return Response.json({ success: false, error: 'Error al registrar equipo' }, { status: 500 });
  }
}
