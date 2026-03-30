import sql from '@/lib/db';
import { isValidOrderStatus, ORDER_STATUS } from '@/lib/order-status';
import { createErrorResponse, createSuccessResponse } from '@/lib/api';

// ──────────────────────────────────────────────
// GET /api/orders?user_id=...&role=admin|technician|client
// ──────────────────────────────────────────────
export async function GET(request: Request) {
  const url = new URL(request.url);
  const user_id = url.searchParams.get('user_id');
  const role = url.searchParams.get('role');

  if (!user_id || !role) {
    return createErrorResponse('user_id y role son requeridos', 400);
  }

  try {
    const lowerRole = role.toLowerCase();
    let orders;

    if (lowerRole === 'admin') {
      orders = await sql`
        SELECT o.*, u.name AS client_name, t.name AS technician_name 
        FROM service_orders o
        JOIN users u ON o.client_id = u.id
        LEFT JOIN users t ON o.technician_id = t.id
        ORDER BY o.created_at DESC
      `;
    } else if (lowerRole === 'technician') {
      orders = await sql`
        SELECT o.*, u.name AS client_name 
        FROM service_orders o
        JOIN users u ON o.client_id = u.id
        WHERE o.technician_id = ${user_id}::uuid
        ORDER BY o.created_at DESC
      `;
    } else {
      // client
      orders = await sql`
        SELECT o.*, t.name AS technician_name 
        FROM service_orders o
        LEFT JOIN users t ON o.technician_id = t.id
        WHERE o.client_id = ${user_id}::uuid
        ORDER BY o.created_at DESC
      `;
    }

    return createSuccessResponse({ orders });
  } catch (error: any) {
    console.error('[GET /api/orders]', error.message);
    return createErrorResponse('Error al obtener órdenes', 500);
  }
}

// ──────────────────────────────────────────────
// POST /api/orders          → Crear orden
// POST /api/orders?id=<uuid> → Actualizar estado
// ──────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const orderId = url.searchParams.get('id');
    const body = await request.json();

    // ── ACTUALIZAR ESTADO ──────────────────────
    if (orderId) {
      const { status, notes } = body;
      console.log(`[ORDER-UPDATE] Solicitud para orden ${orderId} -> ${status}`);

      if (!status) {
        return createErrorResponse('El campo status es requerido', 400);
      }

      const normalizedStatus = status.toLowerCase().trim();

      if (!isValidOrderStatus(normalizedStatus)) {
        return createErrorResponse(`Estado inválido: "${status}".`, 400);
      }

      // --- GUARDIA DE FLUJO: Cotización Aprobada ---
      // Si el técnico intenta marcar como 'in_progress' o 'completed',
      // debe haber al menos una cotización aprobada para esta orden.
      if (normalizedStatus === 'in_progress' || normalizedStatus === 'completed') {
        const approvedQuotes = await sql`
          SELECT id FROM quotes 
          WHERE order_id = ${orderId}::uuid AND status = 'approved'
          LIMIT 1
        `;

        if (approvedQuotes.length === 0) {
          console.log(`[ORDER-UPDATE] BLOQUEADO: Intento de ${normalizedStatus} sin cotización aprobada (Orden: ${orderId})`);
          return createErrorResponse(
            '⚠️ No se puede iniciar el trabajo sin una cotización aprobada por el cliente.',
            403
          );
        }
      }

      const updated = await sql`
        UPDATE service_orders
        SET
          status           = ${normalizedStatus}::order_status,
          technician_notes = ${notes ?? null},
          updated_at       = NOW()
        WHERE id = ${orderId}::uuid
        RETURNING *
      `;

      if (updated.length === 0) {
        return createErrorResponse('Orden no encontrada', 404);
      }

      return createSuccessResponse({ order: updated[0] });
    }

    // ── CREAR ORDEN ────────────────────────────
    const { client_id, equipment_id, service_type, description, address, priority } = body;
    console.log('[ORDER-CREATE] Nueva solicitud de orden recibida para cliente:', client_id);

    if (!client_id || !description || !address) {
      return createErrorResponse('client_id, description y address son requeridos', 400);
    }

    const newOrder = await sql`
      INSERT INTO service_orders
        (client_id, equipment_id, service_type, description, address, priority, status)
      VALUES
        (
          ${client_id}::uuid,
          ${equipment_id ? equipment_id + '::uuid' : null},
          ${service_type ?? 'General'},
          ${description},
          ${address},
          ${priority ?? 'medium'},
          'pending'
        )
      RETURNING *
    `;

    return createSuccessResponse({ order: newOrder[0] }, 201);

  } catch (error: any) {
    console.error('[POST /api/orders] FATAL ERROR:', error.message);
    return createErrorResponse('Error interno del servidor', 500);
  }
}
