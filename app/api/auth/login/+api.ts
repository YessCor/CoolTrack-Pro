import sql from '@/lib/db';
import bcrypt from 'bcryptjs';
import { createErrorResponse, createSuccessResponse } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return createErrorResponse('Email y contraseña requeridos', 400);
    }

    const result = await sql`
      SELECT id, email, name, password_hash, role 
      FROM users 
      WHERE email = ${email} AND is_active = true
    `;

    if (result.length === 0) {
      return createErrorResponse('Usuario no encontrado', 401);
    }

    const user = result[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash || '');

    if (!passwordMatch) {
      return createErrorResponse('Contraseña incorrecta', 401);
    }

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
