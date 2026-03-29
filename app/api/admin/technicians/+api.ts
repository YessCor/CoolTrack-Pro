import sql from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { admin_id, email, password, name, phone } = await request.json();

    if (!admin_id || !email || !password || !name) {
      return Response.json({ success: false, error: 'Datos incompletos' }, { status: 400 });
    }

    // Verificar que quien crea es Admin
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
  // Obtener lista completa de técnicos
  try {
    const techs = await sql`
      SELECT id, name, email, phone, is_active, created_at 
      FROM users 
      WHERE role = 'technician'
      ORDER BY created_at DESC
    `;
    return Response.json({ success: true, technicians: techs });
  } catch (error: any) {
    return Response.json({ success: false, error: 'Error al obtener técnicos' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { order_id, technician_id } = await request.json();
    
    console.log('TECH-API-PATCH - Assigning Payload:', { order_id, technician_id });

    if (!order_id || !technician_id) {
      return Response.json({ success: false, error: 'Order ID y Technician ID requeridos' }, { status: 400 });
    }

    const updatedOrder = await sql`
      UPDATE service_orders 
      SET technician_id = ${technician_id}, 
          status = 'assigned', 
          updated_at = NOW()
      WHERE id = ${order_id}
      RETURNING *;
    `;

    if (updatedOrder.length === 0) {
      return Response.json({ success: false, error: 'Orden no encontrada' }, { status: 404 });
    }

    return Response.json({ success: true, order: updatedOrder[0] });
  } catch (error: any) {
    console.error('TECH-API-PATCH - ERROR:', error);
    return Response.json({ success: false, error: 'Error al asignar técnico', debug: error.message }, { status: 500 });
  }
}
