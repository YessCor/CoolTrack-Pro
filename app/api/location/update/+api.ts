
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth-config';
import sql from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session?.user || session.user.role !== 'technician') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { latitude, longitude, accuracy, heading, speed } = await request.json();

    if (!latitude || !longitude) {
      return Response.json(
        { error: 'Missing latitude or longitude' },
        { status: 400 }
      );
    }

    await sql`
      INSERT INTO technician_locations (
        technician_id,
        latitude,
        longitude,
        accuracy,
        heading,
        speed
      ) VALUES (
        ${session.user.id},
        ${latitude},
        ${longitude},
        ${accuracy || null},
        ${heading || null},
        ${speed || null}
      )
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error updating location:', error);
    return Response.json(
      { error: 'Failed to update location' },
      { status: 500 }
    );
  }
}
