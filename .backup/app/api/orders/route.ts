import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth-config';
import sql from '@/lib/db';
import type { ServiceOrder } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let query;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    if (session.user.role === 'admin') {
      // Admins see all orders
      if (status) {
        query = await sql`
          SELECT * FROM service_orders 
          WHERE status = ${status}
          ORDER BY created_at DESC
        `;
      } else {
        query = await sql`
          SELECT * FROM service_orders 
          ORDER BY created_at DESC
        `;
      }
    } else if (session.user.role === 'technician') {
      // Technicians see their assigned orders
      if (status) {
        query = await sql`
          SELECT * FROM service_orders 
          WHERE technician_id = ${session.user.id} AND status = ${status}
          ORDER BY scheduled_date ASC
        `;
      } else {
        query = await sql`
          SELECT * FROM service_orders 
          WHERE technician_id = ${session.user.id}
          ORDER BY scheduled_date ASC
        `;
      }
    } else {
      // Clients see their own orders
      if (status) {
        query = await sql`
          SELECT * FROM service_orders 
          WHERE client_id = ${session.user.id} AND status = ${status}
          ORDER BY created_at DESC
        `;
      } else {
        query = await sql`
          SELECT * FROM service_orders 
          WHERE client_id = ${session.user.id}
          ORDER BY created_at DESC
        `;
      }
    }

    return NextResponse.json({ data: query as ServiceOrder[] });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session?.user || session.user.role !== 'client') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { service_type, description, scheduled_date, address, equipment_id } = body;

    if (!service_type || !description || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = `CT-${Date.now()}`;

    const result = await sql`
      INSERT INTO service_orders (
        order_number,
        client_id,
        service_type,
        description,
        scheduled_date,
        address,
        equipment_id,
        status,
        priority
      ) VALUES (
        ${orderNumber},
        ${session.user.id},
        ${service_type},
        ${description},
        ${scheduled_date || null},
        ${address},
        ${equipment_id || null},
        'pending',
        'normal'
      ) RETURNING *
    `;

    return NextResponse.json({ data: result[0] as ServiceOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
