import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authConfig } from '@/lib/auth-config'
import sql from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const technicians = await sql`
      SELECT id, email, name, phone, address, is_active, created_at
      FROM users
      WHERE role = 'technician'
      ORDER BY created_at DESC
    `

    return NextResponse.json({ data: technicians })
  } catch (error) {
    console.error('Error fetching technicians:', error)
    return NextResponse.json(
      { error: 'Failed to fetch technicians' },
      { status: 500 }
    )
  }
}
