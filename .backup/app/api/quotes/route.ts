import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth-config';
import sql from '@/lib/db';
import type { Quote } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let query;

    if (session.user.role === 'admin') {
      query = await sql`SELECT * FROM quotes ORDER BY created_at DESC`;
    } else if (session.user.role === 'technician') {
      query = await sql`
        SELECT * FROM quotes 
        WHERE technician_id = ${session.user.id}
        ORDER BY created_at DESC
      `;
    } else {
      query = await sql`
        SELECT * FROM quotes 
        WHERE client_id = ${session.user.id}
        ORDER BY created_at DESC
      `;
    }

    return NextResponse.json({ data: query as Quote[] });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { order_id, client_id, subtotal, tax_rate, items, notes, valid_until } = body;

    if (!client_id || !subtotal) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const quoteNumber = `COT-${Date.now()}`;
    const taxAmount = subtotal * (tax_rate || 0.16);
    const total = subtotal + taxAmount;

    const result = await sql`
      INSERT INTO quotes (
        quote_number,
        order_id,
        client_id,
        technician_id,
        status,
        subtotal,
        tax_rate,
        tax_amount,
        total,
        valid_until,
        notes
      ) VALUES (
        ${quoteNumber},
        ${order_id || null},
        ${client_id},
        ${session.user.role === 'technician' ? session.user.id : null},
        'draft',
        ${subtotal},
        ${tax_rate || 0.16},
        ${taxAmount},
        ${total},
        ${valid_until || null},
        ${notes || null}
      ) RETURNING *
    `;

    // Insert quote items
    if (items && Array.isArray(items)) {
      for (const item of items) {
        await sql`
          INSERT INTO quote_items (
            quote_id,
            description,
            quantity,
            unit_price,
            total
          ) VALUES (
            ${result[0].id},
            ${item.description},
            ${item.quantity},
            ${item.unit_price},
            ${item.total}
          )
        `;
      }
    }

    return NextResponse.json({ data: result[0] as Quote });
  } catch (error) {
    console.error('Error creating quote:', error);
    return NextResponse.json(
      { error: 'Failed to create quote' },
      { status: 500 }
    );
  }
}
