import sql from '@/lib/db';
import { isValidOrderStatus, ORDER_STATUS } from '@/lib/order-status';

// ──────────────────────────────────────────────
// GET /api/orders?user_id=...&role=admin|technician|client
// ──────────────────────────────────────────────
export async function GET(request: Request) {
  const url = new URL(request.url);
  const user_id = url.searchParams.get('user_id');
  const role = url.searchParams.get('role');

  if (!user_id || !role) {
    return Response.json(
      { success: false, error: 'user_id y role son requeridos' },
      { status: 400 }
    );
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
        WHERE o.technician_id = ${user_id}
        ORDER BY o.created_at DESC
      `;
    } else {
      // client
      orders = await sql`
        SELECT o.*, t.name AS technician_name 
        FROM service_orders o
        LEFT JOIN users t ON o.technician_id = t.id
        WHERE o.client_id = ${user_id}
        ORDER BY o.created_at DESC
      `;
    }

    return Response.json({ success: true, orders });
  } catch (error: any) {
    console.error('[GET /api/orders]', error.message);
    return Response.json(
      { success: false, error: 'Error al obtener órdenes' },
      { status: 500 }
    );
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

      if (!status) {
        return Response.json(
          { success: false, error: 'El campo status es requerido' },
          { status: 400 }
        );
      }

      const normalizedStatus = status.toLowerCase().trim();

      // Validación contra el enum real de la DB
      if (!isValidOrderStatus(normalizedStatus)) {
        return Response.json(
          {
            success: false,
            error: `Estado inválido: "${status}". Estados permitidos: ${Object.values(ORDER_STATUS).join(', ')}`,
          },
          { status: 400 }
        );
      }

      console.log(`[API] Orden ${orderId}: → ${normalizedStatus}`);

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
        return Response.json(
          { success: false, error: 'Orden no encontrada' },
          { status: 404 }
        );
      }

      return Response.json({ success: true, order: updated[0] });
    }

    // ── CREAR ORDEN ────────────────────────────
    const { client_id, equipment_id, service_type, description, address, priority } = body;

    if (!client_id || !description || !address) {
      return Response.json(
        { success: false, error: 'client_id, description y address son requeridos' },
        { status: 400 }
      );
    }

    const newOrder = await sql`
      INSERT INTO service_orders
        (client_id, equipment_id, service_type, description, address, priority, status)
      VALUES
        (
          ${client_id},
          ${equipment_id ?? null},
          ${service_type ?? 'General'},
          ${description},
          ${address},
          ${priority ?? 'medium'},
          'pending'
        )
      RETURNING *
    `;

    return Response.json({ success: true, order: newOrder[0] }, { status: 201 });

  } catch (error: any) {
    console.error('[POST /api/orders]', error.message);
    return Response.json(
      { success: false, error: 'Error interno del servidor', detail: error.message },
      { status: 500 }
    );
  }
}
