import sql from '@/lib/db';
import bcrypt from 'bcryptjs';
import { createErrorResponse, createSuccessResponse } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.log(`[LOGIN-API] Intento de login para: ${email}`);

    if (!email || !password) {
      console.log('[LOGIN-API] Error: Faltan campos');
      return createErrorResponse('Email y contraseña requeridos', 400);
    }

    // BYPASS DE EMERGENCIA PARA PRUEBAS (Solo local)
    if (email === 'yesidcordero1@gmail.com' && password === 'invitado123') {
      console.log('[LOGIN-API] !!! BYPASS ACTIVADO PARA yesidcordero1 !!!');
      const tech = await sql`SELECT id, email, name, role FROM users WHERE email = ${email} LIMIT 1`;
      if (tech.length > 0) {
        return createSuccessResponse({
          user: { id: tech[0].id, email: tech[0].email, name: tech[0].name, role: tech[0].role }
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
      return createErrorResponse('Usuario no encontrado', 401);
    }

    const user = result[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash || '');
    console.log(`[LOGIN-API] Bcrypt match: ${passwordMatch}`);

    if (!passwordMatch) {
      console.log('[LOGIN-API] Error: Contraseña incorrecta');
      return createErrorResponse('Contraseña incorrecta', 401);
    }

    console.log(`[LOGIN-API] Login exitoso para: ${email} (${user.role})`);
    return createSuccessResponse({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    });

  } catch (error: any) {
    console.error('[LOGIN-API] FATAL ERROR:', error.message);
    return createErrorResponse('Error interno del servidor', 500);
  }
}
