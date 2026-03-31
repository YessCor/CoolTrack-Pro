import { z } from 'zod';
import { OrderStatus, ORDER_STATUS } from '../order-status';

export const WorkOrderTypeSchema = z.enum(['preventivo', 'correctivo']);
export type WorkOrderType = z.infer<typeof WorkOrderTypeSchema>;

export const WorkOrderPrioritySchema = z.enum(['low', 'medium', 'high', 'emergency']);
export type WorkOrderPriority = z.infer<typeof WorkOrderPrioritySchema>;

export const WorkOrderLocationSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  accuracy: z.number().optional(),
  timestamp: z.string().optional(),
});

export const WorkOrderSchema = z.object({
  id: z.string(),
  order_number: z.string(),
  client_id: z.string(),
  equipment_id: z.string().optional(),
  technician_id: z.string().optional(),
  status: z.string(),
  priority: WorkOrderPrioritySchema,
  service_type: WorkOrderTypeSchema,
  description: z.string(),
  scheduled_date: z.string().optional(),
  started_at: z.string().optional(),
  completed_at: z.string().optional(),
  address: z.string(),
  start_location: WorkOrderLocationSchema.optional(),
  end_location: WorkOrderLocationSchema.optional(),
  client_signature: z.string().optional(),
  signer_name: z.string().optional(),
  signature_timestamp: z.string().optional(),
  technician_notes: z.string().optional(),
  photos: z.array(z.string()).default([]),
  parts_used: z.array(z.object({
    id: z.string(),
    part_number: z.string().optional(),
    name: z.string(),
    quantity: z.number(),
    unit_price: z.number(),
  })).default([]),
  labor_hours: z.number().optional(),
  labor_cost: z.number().optional(),
  parts_cost: z.number().optional(),
  total_cost: z.number().optional(),
  checklist: z.record(z.string(), z.boolean()).optional(),
  problem_description: z.string().optional(),
  solution_applied: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type WorkOrder = z.infer<typeof WorkOrderSchema>;
export type WorkOrderLocation = z.infer<typeof WorkOrderLocationSchema>;
export type PartUsed = z.infer<typeof WorkOrderSchema>['parts_used'][number];

export type WorkOrderState = OrderStatus;

export const VALID_WORK_ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['assigned'],
  assigned: ['accepted', 'cancelled'],
  accepted: ['in_transit', 'cancelled'],
  in_transit: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

export function canTransitionTo(currentStatus: OrderStatus, nextStatus: OrderStatus): boolean {
  return VALID_WORK_ORDER_TRANSITIONS[currentStatus]?.includes(nextStatus) ?? false;
}

export function createWorkOrder(
  data: Omit<WorkOrder, 'id' | 'order_number' | 'status' | 'created_at' | 'updated_at' | 'photos' | 'parts_used'>
): Omit<WorkOrder, 'id' | 'order_number'> {
  const now = new Date().toISOString();
  return {
    ...data,
    status: ORDER_STATUS.PENDING,
    photos: [],
    parts_used: [],
    created_at: now,
    updated_at: now,
  };
}

export function transitionWorkOrder(
  order: WorkOrder,
  newStatus: OrderStatus
): { success: boolean; order?: WorkOrder; error?: string } {
  if (!canTransitionTo(order.status as OrderStatus, newStatus)) {
    return {
      success: false,
      error: `No se puede cambiar de ${order.status} a ${newStatus}`,
    };
  }

  const updated = { ...order, status: newStatus, updated_at: new Date().toISOString() };

  if (newStatus === ORDER_STATUS.IN_PROGRESS && !order.started_at) {
    updated.started_at = new Date().toISOString();
  }

  if (newStatus === ORDER_STATUS.COMPLETED && !order.completed_at) {
    updated.completed_at = new Date().toISOString();
  }

  return { success: true, order: updated as WorkOrder };
}

export const WORK_ORDER_PRIORITY_LABELS: Record<WorkOrderPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  emergency: 'Emergencia',
};

export const WORK_ORDER_TYPE_LABELS: Record<WorkOrderType, string> = {
  preventivo: 'Preventivo',
  correctivo: 'Correctivo',
};
