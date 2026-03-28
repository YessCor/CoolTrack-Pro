
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth-config';
import sql from '@/lib/db';
import type { Equipment } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let query;

    if (session.user.role === 'admin') {
      query = await sql`SELECT * FROM equipment ORDER BY created_at DESC`;
    } else {
      // Clients only see their own equipment
      query = await sql`
        SELECT * FROM equipment 
        WHERE client_id = ${session.user.id}
        ORDER BY created_at DESC
      `;
    }

    return Response.json({ data: query as Equipment[] });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return Response.json(
      { error: 'Failed to fetch equipment' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session?.user || session.user.role !== 'client') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, type, brand, model, serial_number, capacity_tons, location_description, notes } = body;

    if (!name || !type) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO equipment (
        client_id,
        name,
        type,
        brand,
        model,
        serial_number,
        capacity_tons,
        location_description,
        notes
      ) VALUES (
        ${session.user.id},
        ${name},
        ${type},
        ${brand || null},
        ${model || null},
        ${serial_number || null},
        ${capacity_tons || null},
        ${location_description || null},
        ${notes || null}
      ) RETURNING *
    `;

    return Response.json({ data: result[0] as Equipment });
  } catch (error) {
    console.error('Error creating equipment:', error);
    return Response.json(
      { error: 'Failed to create equipment' },
      { status: 500 }
    );
  }
}
