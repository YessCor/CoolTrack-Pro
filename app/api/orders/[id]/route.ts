import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authConfig } from '@/lib/auth-config'
import sql from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orderId = params.id

    let query
    if (session.user.role === 'admin') {
      query = await sql`
        SELECT o.*, 
               c.name as client_name,
               c.email as client_email,
               t.name as technician_name,
               t.phone as technician_phone,
               e.name as equipment_name
        FROM service_orders o
        LEFT JOIN users c ON o.client_id = c.id
        LEFT JOIN users t ON o.technician_id = t.id
        LEFT JOIN equipment e ON o.equipment_id = e.id
        WHERE o.id = ${orderId}
      `
    } else if (session.user.role === 'technician') {
      query = await sql`
        SELECT o.*, 
               c.name as client_name,
               c.email as client_email,
               t.name as technician_name,
               t.phone as technician_phone,
               e.name as equipment_name
        FROM service_orders o
        LEFT JOIN users c ON o.client_id = c.id
        LEFT JOIN users t ON o.technician_id = t.id
        LEFT JOIN equipment e ON o.equipment_id = e.id
        WHERE o.id = ${orderId} AND o.technician_id = ${session.user.id}
      `
    } else {
      // Client
      query = await sql`
        SELECT o.*, 
               c.name as client_name,
               c.email as client_email,
               t.name as technician_name,
               t.phone as technician_phone,
               e.name as equipment_name
        FROM service_orders o
        LEFT JOIN users c ON o.client_id = c.id
        LEFT JOIN users t ON o.technician_id = t.id
        LEFT JOIN equipment e ON o.equipment_id = e.id
        WHERE o.id = ${orderId} AND o.client_id = ${session.user.id}
      `
    }

    if (!query || query.length === 0) {
      return NextResponse.json(
        { error: 'Order not found or unauthorized' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: query[0] })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orderId = params.id
    const body = await request.json()

    // Only allow clients to update rating and feedback
    if (session.user.role === 'client') {
      const { client_rating, client_feedback } = body

      const result = await sql`
        UPDATE service_orders
        SET client_rating = ${client_rating || null},
            client_feedback = ${client_feedback || null},
            updated_at = NOW()
        WHERE id = ${orderId} AND client_id = ${session.user.id}
        RETURNING *
      `

      if (!result || result.length === 0) {
        return NextResponse.json(
          { error: 'Order not found or unauthorized' },
          { status: 404 }
        )
      }

      return NextResponse.json({ data: result[0] })
    }

    // Admin and technician can update status and other fields
    if (session.user.role === 'admin' || session.user.role === 'technician') {
      const { status, technician_notes, total_amount } = body

      const result = await sql`
        UPDATE service_orders
        SET status = ${status || null},
            technician_notes = ${technician_notes || null},
            total_amount = ${total_amount || null},
            updated_at = NOW()
        WHERE id = ${orderId}
        RETURNING *
      `

      if (!result || result.length === 0) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ data: result[0] })
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
