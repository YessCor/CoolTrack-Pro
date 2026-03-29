import sql from '@/lib/db';

export async function PATCH(request: Request) {
  try {
    const { user_id, avatar_url } = await request.json();

    if (!user_id || !avatar_url) {
      return Response.json({ success: false, error: 'User ID y URL de avatar requeridos' }, { status: 400 });
    }

    // Actualizar el campo avatar_url en la tabla de usuarios
    const updatedUser = await sql`
      UPDATE users 
      SET avatar_url = ${avatar_url}, updated_at = NOW()
      WHERE id = ${user_id}
      RETURNING id, name, email, avatar_url, role;
    `;

    if (updatedUser.length === 0) {
      return Response.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
    }

    return Response.json({ 
      success: true, 
      user: {
        ...updatedUser[0],
        role: updatedUser[0].role.toUpperCase()
      }
    });
  } catch (error: any) {
    console.error('Error updating avatar:', error);
    return Response.json({ success: false, error: 'Error al actualizar la foto de perfil' }, { status: 500 });
  }
}
