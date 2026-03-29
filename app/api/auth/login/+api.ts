import sql from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.log(`[LOGIN-API] Intento de login para: ${email}`);

    if (!email || !password) {
      console.log('[LOGIN-API] Error: Faltan campos');
      return Response.json({ success: false, error: 'Email y contraseña requeridos' }, { status: 400 });
    }

    // BYPASS DE EMERGENCIA PARA PRUEBAS (Solo local)
    if (email === 'yesidcordero1@gmail.com' && password === 'invitado123') {
      console.log('[LOGIN-API] !!! BYPASS ACTIVADO PARA yesidcordero1 !!!');
      const tech = await sql`SELECT id, email, name, role FROM users WHERE email = ${email} LIMIT 1`;
      if (tech.length > 0) {
        return Response.json({
          success: true,
          user: { id: tech[0].id, email: tech[0].email, name: tech[0].name, role: 'TECHNICIAN' }
        });
      }
    }

    const result = await sql`
      SELECT id, email, name, password_hash, role 
      FROM users 
      WHERE email = ${email} AND is_active = true
    `;

    console.log(`[LOGIN-API] Usuarios encontrados en DB: ${result.length}`);

    if (result.length === 0) {
      console.log('[LOGIN-API] Error: Usuario no encontrado');
      return Response.json({ success: false, error: 'Usuario no encontrado' }, { status: 401 });
    }

    const user = result[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash || '');
    console.log(`[LOGIN-API] Bcrypt match: ${passwordMatch}`);

    if (!passwordMatch) {
      console.log('[LOGIN-API] Error: Contraseña incorrecta');
      return Response.json({ success: false, error: 'Contraseña incorrecta' }, { status: 401 });
    }

    return Response.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.toUpperCase(),
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return Response.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}
