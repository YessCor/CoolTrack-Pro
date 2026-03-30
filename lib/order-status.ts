/**
 * FUENTE ÚNICA DE VERDAD para los estados de órdenes.
 * Estos son los ÚNICOS valores válidos en el enum order_status de la DB.
 * 
 * Flujo de estados:
 *   [CLIENTE]     pending  →  (admin asigna)
 *   [ADMIN]       pending  →  assigned
 *   [TÉCNICO]     assigned →  accepted  →  in_transit  →  in_progress  →  completed
 */

export const ORDER_STATUS = {
  PENDING:     'pending',
  ASSIGNED:    'assigned',
  ACCEPTED:    'accepted',
  IN_TRANSIT:  'in_transit',
  IN_PROGRESS: 'in_progress',
  COMPLETED:   'completed',
  CANCELLED:   'cancelled',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

// Set para validación O(1)
export const VALID_ORDER_STATUSES = new Set<string>(Object.values(ORDER_STATUS));

export function isValidOrderStatus(value: string): value is OrderStatus {
  return VALID_ORDER_STATUSES.has(value.toLowerCase());
}

// Etiquetas en español para UI
export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending:     'Pendiente',
  assigned:    'Asignado',
  accepted:    'Aceptado',
  in_transit:  'En Camino',
  in_progress: 'En Progreso',
  completed:   'Completado',
  cancelled:   'Cancelado',
};

// Transiciones permitidas por rol
export const ALLOWED_TRANSITIONS: Record<string, OrderStatus[]> = {
  admin: ['assigned', 'cancelled'],           // desde pending
  technician: ['accepted', 'in_transit', 'in_progress', 'completed'],
  client: [],                                 // cliente no cambia estado
};

// Siguiente estado del técnico en el flujo lineal
export const TECHNICIAN_NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  assigned:    'accepted',
  accepted:    'in_transit',
  in_transit:  'in_progress',
  in_progress: 'completed',
};
