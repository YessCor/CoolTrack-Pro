import sql from '@/lib/db'
import bcrypt from 'bcryptjs'
import { createSuccessResponse, createErrorResponse } from '@/lib/api'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('user_id')
    const role = url.searchParams.get('role')

    if (!userId || !role) {
      return createErrorResponse('user_id y role son requeridos', 400)
    }

    if (role !== 'admin') {
      return createErrorResponse('Solo admins pueden ver clientes', 403)
    }

    const clients = await sql`
      SELECT 
        u.id, u.email, u.name, u.phone, u.address, u.is_active, u.created_at,
        COALESCE((
          SELECT COUNT(*)::int 
          FROM equipment e 
          WHERE e.client_id = u.id
        ), 0) as equipment_count,
        COALESCE((
          SELECT COUNT(*)::int 
          FROM service_orders o 
          WHERE o.client_id = u.id
        ), 0) as total_orders,
        COALESCE((
          SELECT COUNT(*)::int 
          FROM service_orders o 
          WHERE o.client_id = u.id 
          AND o.status IN ('pending', 'assigned', 'accepted', 'in_transit', 'in_progress')
        ), 0) as pending_orders
      FROM users u
      WHERE u.role = 'client'
      ORDER BY u.created_at DESC
    `

    return createSuccessResponse({ clients })
  } catch (error: any) {
    console.error('[GET /api/admin/clients]', error.message)
    return createErrorResponse('Error al obtener clientes', 500)
  }
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url)
    const adminId = url.searchParams.get('admin_id')

    if (!adminId) {
      return createErrorResponse('admin_id es requerido', 400)
    }

    const { name, email, phone, password, address } = await request.json()

    if (!name || !email || !password) {
      return createErrorResponse('Nombre, email y contraseña son requeridos', 400)
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existing.length > 0) {
      return createErrorResponse('El correo ya está registrado', 409)
    }

    const hash = await bcrypt.hash(password, 10)

    const newClient = await sql`
      INSERT INTO users (email, password_hash, name, phone, address, role)
      VALUES (${email}, ${hash}, ${name}, ${phone || null}, ${address || null}, 'client')
      RETURNING id, email, name, phone, address, role, created_at
    `

    return createSuccessResponse({ client: newClient[0] })
  } catch (error: any) {
    console.error('[POST /api/admin/clients]', error.message)
    return createErrorResponse('Error al crear cliente', 500)
  }
}
