import sql from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password, name, phone } = await request.json();

    if (!email || !password || !name) {
      return Response.json({ success: false, error: 'Campos requeridos faltantes' }, { status: 400 });
    }

    // Verificar si el usuario ya existe
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return Response.json({ success: false, error: 'El correo ya está registrado' }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await sql`
      INSERT INTO users (email, password_hash, name, phone, role)
      VALUES (${email}, ${hash}, ${name}, ${phone || null}, 'client')
      RETURNING id, email, name, role;
    `;

    return Response.json({ 
      success: true, 
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        name: newUser[0].name,
        role: newUser[0].role.toUpperCase()
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return Response.json({ success: false, error: 'Error al registrar usuario' }, { status: 500 });
  }
}
