import sql from '@/lib/db';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const client_id = url.searchParams.get('client_id');

  if (!client_id) {
    return Response.json({ success: false, error: 'Client ID requerido' }, { status: 400 });
  }

  try {
    const equipments = await sql`
      SELECT * FROM hvac_equipment 
      WHERE client_id = ${client_id}
      ORDER BY created_at DESC
    `;

    return Response.json({ success: true, equipments });
  } catch (error: any) {
    console.error('Fetch client equipment error:', error);
    return Response.json({ success: false, error: 'Error al obtener equipos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { 
      client_id, 
      type, 
      brand, 
      model, 
      serial_number, 
      location 
    } = await request.json();

    if (!client_id || !type || !location) {
      return Response.json({ success: false, error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const newEquipment = await sql`
      INSERT INTO hvac_equipment (client_id, type, brand, model, serial_number, location)
      VALUES (${client_id}, ${type}, ${brand || null}, ${model || null}, ${serial_number || null}, ${location})
      RETURNING *;
    `;

    return Response.json({ success: true, equipment: newEquipment[0] });
  } catch (error: any) {
    console.error('Create equipment error:', error);
    return Response.json({ success: false, error: 'Error al registrar equipo' }, { status: 500 });
  }
}
