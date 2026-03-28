
import { getServerSession } from 'next-auth/next'
import { authConfig } from '@/lib/auth-config'
import sql from '@/lib/db'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user || session.user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clients = await sql`
      SELECT id, email, name, phone, address, is_active, created_at
      FROM users
      WHERE role = 'client'
      ORDER BY created_at DESC
    `

    return Response.json({ data: clients })
  } catch (error) {
    console.error('Error fetching clients:', error)
    return Response.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}
