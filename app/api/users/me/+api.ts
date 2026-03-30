
import { auth } from '@/lib/auth';
import sql from '@/lib/db';
import type { User } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await sql`
      SELECT id, email, name, phone, role, avatar_url, address, created_at, updated_at
      FROM users
      WHERE id = ${session.user.id}
    `;

    if (result.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({ data: result[0] as User });
  } catch (error) {
    console.error('Error fetching user:', error);
    return Response.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
