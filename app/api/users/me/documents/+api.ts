import sql from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { user_id, url, public_id, resource_type, context, caption } = await request.json();

    if (!user_id || !url || !public_id) {
      return Response.json({ success: false, error: 'Información de archivo incompleta' }, { status: 400 });
    }

    // Insertar en la tabla de media
    const newMedia = await sql`
      INSERT INTO media (url, public_id, resource_type, uploaded_by, context, caption)
      VALUES (${url}, ${public_id}, ${resource_type || 'image'}, ${user_id}, ${context || 'document'}, ${caption || null})
      RETURNING id, url, context;
    `;

    return Response.json({ success: true, media: newMedia[0] });
  } catch (error: any) {
    console.error('Error saving media record:', error);
    return Response.json({ success: false, error: 'Error al registrar el documento en la base de datos' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const user_id = url.searchParams.get('user_id');

  if (!user_id) {
    return Response.json({ success: false, error: 'User ID requerido' }, { status: 400 });
  }

  try {
    const documents = await sql`
      SELECT id, url, context, caption, created_at 
      FROM media 
      WHERE uploaded_by = ${user_id} AND context = 'document'
      ORDER BY created_at DESC
    `;
    return Response.json({ success: true, documents });
  } catch (error: any) {
    return Response.json({ success: false, error: 'Error al obtener documentos' }, { status: 500 });
  }
}
