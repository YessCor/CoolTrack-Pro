import sql from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { admin_id, email, password, name, phone } = await request.json();

    if (!admin_id || !email || !password || !name) {
      return Response.json({ success: false, error: 'Datos incompletos' }, { status: 400 });
    }

    const adminCheck = await sql`SELECT role FROM users WHERE id = ${admin_id}`;
    if (adminCheck.length === 0 || adminCheck[0].role !== 'admin') {
      return Response.json({ success: false, error: 'No autorizado' }, { status: 403 });
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return Response.json({ success: false, error: 'El correo ya está registrado' }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);

    const newTech = await sql`
      INSERT INTO users (email, password_hash, name, phone, role)
      VALUES (${email}, ${hash}, ${name}, ${phone || null}, 'technician')
      RETURNING id, email, name;
    `;

    return Response.json({ success: true, technician: newTech[0] });
  } catch (error: any) {
    console.error('Admin create technician error:', error);
    return Response.json({ success: false, error: 'Error al crear técnico' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const techs = await sql`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.phone, 
        u.is_active, 
        u.created_at,
        CASE WHEN EXISTS (
          SELECT 1 FROM service_orders o 
          WHERE o.technician_id = u.id 
          AND o.status IN ('assigned', 'accepted', 'in_transit', 'in_progress')
        ) THEN true ELSE false END as is_busy
      FROM users u
      WHERE u.role = 'technician'
      ORDER BY u.created_at DESC
    `;
    return Response.json({ success: true, technicians: techs });
  } catch (error: any) {
    return Response.json({ success: false, error: 'Error al obtener técnicos' }, { status: 500 });
  }
}


