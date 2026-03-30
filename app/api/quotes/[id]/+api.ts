import sql from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const url = new URL(request.url);
    const user_id = url.searchParams.get('user_id');
    const role = url.searchParams.get('role');
    
    if (!user_id || !role) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const quote = await sql`
      SELECT q.*, 
             u_client.name as client_name, 
             u_tech.name as technician_name
      FROM quotes q
      JOIN users u_client ON q.client_id = u_client.id
      LEFT JOIN users u_tech ON q.technician_id = u_tech.id
      WHERE q.id = ${params.id}::uuid
    `;

    if (quote.length === 0) {
      return Response.json({ success: false, error: 'Cotización no encontrada' }, { status: 404 });
    }

    const items = await sql`
      SELECT * FROM quote_items WHERE quote_id = ${params.id}::uuid ORDER BY created_at ASC
    `;

    return Response.json({ success: true, quote: quote[0], items });
  } catch (error: any) {
    console.error('[GET /api/quotes/[id]]', error);
    return Response.json({ success: false, error: 'Error al obtener detalle' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const url = new URL(request.url);
    const user_id = url.searchParams.get('user_id');
    const role = url.searchParams.get('role');
    
    if (!user_id || !role) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await request.json();
    const validStatuses = ['draft', 'sent', 'approved', 'rejected', 'expired'];

    if (!status || !validStatuses.includes(status)) {
      return Response.json({ success: false, error: 'Estado inválido' }, { status: 400 });
    }

    const updated = await sql`
      UPDATE quotes 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${params.id}::uuid
      RETURNING *;
    `;

    if (updated.length === 0) {
      return Response.json({ success: false, error: 'Cotización no encontrada' }, { status: 404 });
    }

    return Response.json({ success: true, quote: updated[0] });
  } catch (error: any) {
    console.error('[PATCH /api/quotes/[id]]', error);
    return Response.json({ success: false, error: 'Error al actualizar estado' }, { status: 500 });
  }
}
