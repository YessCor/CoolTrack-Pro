import sql from '@/lib/db';
import { createSuccessResponse, createErrorResponse } from '@/lib/api';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');
    const role = url.searchParams.get('role');
    const client_id = url.searchParams.get('client_id');

    if (!userId || !role) {
      return createErrorResponse('user_id y role son requeridos', 400);
    }

    if (role !== 'admin') {
      return createErrorResponse('Solo admins pueden ver equipos', 403);
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (client_id && !uuidRegex.test(client_id)) {
      return createErrorResponse('client_id debe ser un UUID válido', 400);
    }

    let query;
    if (client_id) {
      query = await sql`
        SELECT 
          e.*,
          u.name as client_name,
          u.email as client_email,
          u.phone as client_phone,
          u.address as client_address,
          COALESCE(
            (SELECT json_agg(json_build_object(
              'id', o.id,
              'order_number', o.order_number,
              'status', o.status,
              'service_type', o.service_type,
              'description', o.description,
              'technician_name', t.name,
              'created_at', o.created_at,
              'completed_at', o.completed_at
            ) ORDER BY o.created_at DESC)
            FROM service_orders o
            LEFT JOIN users t ON o.technician_id = t.id
            WHERE o.equipment_id = e.id
            ),
            '[]'::json
          ) as service_history
        FROM equipment e
        JOIN users u ON e.client_id = u.id
        WHERE e.client_id = ${client_id}::uuid
        ORDER BY e.created_at DESC
      `;
    } else {
      query = await sql`
        SELECT 
          e.*,
          u.name as client_name,
          u.email as client_email,
          COUNT(o.id) as service_count,
          MAX(o.created_at) as last_service
        FROM equipment e
        JOIN users u ON e.client_id = u.id
        LEFT JOIN service_orders o ON o.equipment_id = e.id
        GROUP BY e.id, u.id
        ORDER BY e.created_at DESC
      `;
    }

    return createSuccessResponse({ equipment: query });
  } catch (error: any) {
    console.error('[GET /api/admin/equipment]', error.message);
    return createErrorResponse('Error al obtener equipos', 500);
  }
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const role = url.searchParams.get('role');

    if (role !== 'admin') {
      return createErrorResponse('Solo admins pueden crear equipos', 403);
    }

    const {
      client_id,
      name,
      type,
      brand,
      model,
      serial_number,
      capacity_tons,
      installation_date,
      location_description,
      notes,
    } = await request.json();

    if (!client_id || !type || !location_description) {
      return createErrorResponse('client_id, tipo y ubicación son requeridos', 400);
    }

    const sanitizedClientId = String(client_id).replace(/::uuid$/, '');
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(sanitizedClientId)) {
      return createErrorResponse('client_id debe ser un UUID válido', 400);
    }

    const clientExists = await sql`SELECT id FROM users WHERE id = ${sanitizedClientId}::uuid AND role = 'client'`;
    if (clientExists.length === 0) {
      return createErrorResponse('Cliente no encontrado', 404);
    }

    const newEquipment = await sql`
      INSERT INTO equipment (
        client_id, name, type, brand, model, serial_number, 
        capacity_tons, installation_date, location_description, notes
      )
      VALUES (
        ${sanitizedClientId}::uuid, 
        ${name || null}, 
        ${type}, 
        ${brand || null}, 
        ${model || null}, 
        ${serial_number || null},
        ${capacity_tons || null},
        ${installation_date || null},
        ${location_description}, 
        ${notes || null}
      )
      RETURNING *
    `;

    const equipmentWithClient = await sql`
      SELECT e.*, u.name as client_name, u.email as client_email
      FROM equipment e
      JOIN users u ON e.client_id = u.id
      WHERE e.id = ${newEquipment[0].id}
    `;

    return createSuccessResponse({ equipment: equipmentWithClient[0] });
  } catch (error: any) {
    console.error('[POST /api/admin/equipment]', error.message);
    return createErrorResponse('Error al crear equipo', 500);
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const role = url.searchParams.get('role');

    if (role !== 'admin') {
      return createErrorResponse('Solo admins pueden actualizar equipos', 403);
    }

    const {
      id,
      client_id,
      name,
      type,
      brand,
      model,
      serial_number,
      capacity_tons,
      installation_date,
      location_description,
      notes,
    } = await request.json();

    if (!id) {
      return createErrorResponse('ID del equipo es requerido', 400);
    }

    const sanitizedClientId = client_id ? String(client_id).replace(/::uuid$/, '') : null;
    const sanitizedId = String(id).replace(/::uuid$/, '');

    if (sanitizedClientId) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(sanitizedClientId)) {
        return createErrorResponse('client_id debe ser un UUID válido', 400);
      }
    }

    let query;
    if (sanitizedClientId) {
      query = await sql`
        UPDATE equipment SET
          client_id = ${sanitizedClientId}::uuid,
          name = ${name ?? null},
          type = ${type ?? null},
          brand = ${brand ?? null},
          model = ${model ?? null},
          serial_number = ${serial_number ?? null},
          capacity_tons = ${capacity_tons ?? null},
          installation_date = ${installation_date ?? null},
          location_description = ${location_description ?? null},
          notes = ${notes ?? null},
          updated_at = NOW()
        WHERE id = ${sanitizedId}::uuid
        RETURNING *
      `;
    } else {
      query = await sql`
        UPDATE equipment SET
          name = ${name ?? null},
          type = ${type ?? null},
          brand = ${brand ?? null},
          model = ${model ?? null},
          serial_number = ${serial_number ?? null},
          capacity_tons = ${capacity_tons ?? null},
          installation_date = ${installation_date ?? null},
          location_description = ${location_description ?? null},
          notes = ${notes ?? null},
          updated_at = NOW()
        WHERE id = ${sanitizedId}::uuid
        RETURNING *
      `;
    }

    if (query.length === 0) {
      return createErrorResponse('Equipo no encontrado', 404);
    }

    const equipmentWithClient = await sql`
      SELECT e.*, u.name as client_name, u.email as client_email
      FROM equipment e
      JOIN users u ON e.client_id = u.id
      WHERE e.id = ${sanitizedId}::uuid
    `;

    return createSuccessResponse({ equipment: equipmentWithClient[0] });
  } catch (error: any) {
    console.error('[PUT /api/admin/equipment]', error.message);
    return createErrorResponse('Error al actualizar equipo', 500);
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const role = url.searchParams.get('role');
    const id = url.searchParams.get('id');

    if (role !== 'admin') {
      return createErrorResponse('Solo admins pueden eliminar equipos', 403);
    }

    if (!id) {
      return createErrorResponse('ID del equipo es requerido', 400);
    }

    const deleted = await sql`
      DELETE FROM equipment WHERE id = ${id}::uuid RETURNING id
    `;

    if (deleted.length === 0) {
      return createErrorResponse('Equipo no encontrado', 404);
    }

    return createSuccessResponse({ message: 'Equipo eliminado' });
  } catch (error: any) {
    console.error('[DELETE /api/admin/equipment]', error.message);
    return createErrorResponse('Error al eliminar equipo', 500);
  }
}
