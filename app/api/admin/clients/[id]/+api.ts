import sql from '@/lib/db'
import { createSuccessResponse, createErrorResponse } from '@/lib/api'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('user_id')

    if (!userId) {
      return createErrorResponse('user_id es requerido', 400)
    }

    const clientId = params.id

    await sql`
      UPDATE users 
      SET is_active = false, updated_at = now()
      WHERE id = ${clientId} AND role = 'client'
    `

    return createSuccessResponse({ message: 'Cliente eliminado correctamente' })
  } catch (error: any) {
    console.error('[DELETE /api/admin/clients/:id]', error.message)
    return createErrorResponse('Error al eliminar cliente', 500)
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('user_id')

    if (!userId) {
      return createErrorResponse('user_id es requerido', 400)
    }

    const clientId = params.id
    const body = await request.json()

    const { name, phone, address, notes, contact_name, alternate_phone } = body

    const updated = await sql`
      UPDATE users 
      SET 
        name = COALESCE(${name}, name),
        phone = COALESCE(${phone}, phone),
        address = COALESCE(${address}, address),
        updated_at = now()
      WHERE id = ${clientId} AND role = 'client'
      RETURNING id, email, name, phone, address, is_active, created_at
    `

    if (updated.length === 0) {
      return createErrorResponse('Cliente no encontrado', 404)
    }

    return createSuccessResponse({ client: updated[0] })
  } catch (error: any) {
    console.error('[PUT /api/admin/clients/:id]', error.message)
    return createErrorResponse('Error al actualizar cliente', 500)
  }
}
