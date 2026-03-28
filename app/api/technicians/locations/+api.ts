import { auth } from '@/lib/auth'
import sql from '@/lib/db'
import { createSuccessResponse, createErrorResponse } from '@/lib/api'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return createErrorResponse('Unauthorized', 401)
    }

    const locations = await sql`
      SELECT tl.*, u.name, u.email, u.phone
      FROM technician_locations tl
      JOIN users u ON tl.technician_id = u.id
      WHERE tl.recorded_at > NOW() - INTERVAL '1 hour'
      ORDER BY tl.recorded_at DESC
    `

    return createSuccessResponse(locations)
  } catch (error) {
    console.error('Technician locations error:', error)
    return createErrorResponse('Failed to fetch technician locations')
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'technician') {
      return createErrorResponse('Unauthorized', 401)
    }

    const body = await request.json()
    const { latitude, longitude, accuracy, heading, speed } = body

    if (!latitude || !longitude) {
      return createErrorResponse('Missing latitude or longitude')
    }

    const result = await sql`
      INSERT INTO technician_locations (
        technician_id, latitude, longitude, accuracy, heading, speed
      ) VALUES (
        ${session.user.id}, ${latitude}, ${longitude}, 
        ${accuracy || null}, ${heading || null}, ${speed || null}
      )
      RETURNING *
    `

    return createSuccessResponse(result[0], 201)
  } catch (error) {
    console.error('Update location error:', error)
    return createErrorResponse('Failed to update location')
  }
}
