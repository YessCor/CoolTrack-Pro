import { WorkOrder, WorkOrderSchema, transitionWorkOrder, createWorkOrder } from '../models/work-order';
import { OrderStatus, ORDER_STATUS } from '../order-status';
import { getItem, getAll, setItem, removeItem, query, generateId } from '../storage';

const ENTITY = 'work_orders';

export async function getWorkOrder(id: string): Promise<WorkOrder | null> {
  return getItem<WorkOrder>(ENTITY, id);
}

export async function getAllWorkOrders(): Promise<WorkOrder[]> {
  const orders = await getAll<WorkOrder>(ENTITY);
  return orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getWorkOrdersByTechnician(technicianId: string): Promise<WorkOrder[]> {
  const orders = await getAllWorkOrders();
  return orders.filter(o => o.technician_id === technicianId);
}

export async function getWorkOrdersByClient(clientId: string): Promise<WorkOrder[]> {
  const orders = await getAllWorkOrders();
  return orders.filter(o => o.client_id === clientId);
}

export async function getWorkOrdersByStatus(status: OrderStatus): Promise<WorkOrder[]> {
  const orders = await getAllWorkOrders();
  return orders.filter(o => o.status === status);
}

export async function createWorkOrderRepository(
  data: Omit<WorkOrder, 'id' | 'order_number' | 'status' | 'created_at' | 'updated_at' | 'photos' | 'parts_used'>
): Promise<WorkOrder> {
  const orderData = createWorkOrder(data);
  const id = generateId();
  const order: WorkOrder = {
    ...orderData,
    id,
    order_number: `WO-${id.substring(0, 8).toUpperCase()}`,
  } as WorkOrder;
  
  const parsed = WorkOrderSchema.safeParse(order);
  if (!parsed.success) {
    throw new Error(`Invalid work order data: ${parsed.error.message}`);
  }
  
  await setItem(ENTITY, order);
  return order;
}

export async function updateWorkOrderRepository(
  id: string,
  data: Partial<WorkOrder>
): Promise<WorkOrder | null> {
  const existing = await getWorkOrder(id);
  if (!existing) return null;
  
  const updated: WorkOrder = { ...existing, ...data, updated_at: new Date().toISOString() } as WorkOrder;
  const parsed = WorkOrderSchema.safeParse(updated);
  if (!parsed.success) {
    throw new Error(`Invalid work order data: ${parsed.error.message}`);
  }
  
  await setItem(ENTITY, updated);
  return updated;
}

export async function transitionWorkOrderRepository(
  id: string,
  newStatus: OrderStatus
): Promise<{ success: boolean; order?: WorkOrder; error?: string }> {
  const existing = await getWorkOrder(id);
  if (!existing) {
    return { success: false, error: 'Orden no encontrada' };
  }
  
  const result = transitionWorkOrder(existing, newStatus);
  if (!result.success) {
    return result;
  }
  
  await setItem(ENTITY, result.order!);
  return result;
}

export async function deleteWorkOrder(id: string): Promise<void> {
  return removeItem(ENTITY, id) as Promise<void>;
}

export async function searchWorkOrders(term: string): Promise<WorkOrder[]> {
  const orders = await getAllWorkOrders();
  const lowerTerm = term.toLowerCase();
  return orders.filter(o =>
    o.order_number.toLowerCase().includes(lowerTerm) ||
    o.description.toLowerCase().includes(lowerTerm) ||
    o.address.toLowerCase().includes(lowerTerm)
  );
}

export async function getWorkOrderStats(): Promise<{
  pending: number;
  in_progress: number;
  completed: number;
  total: number;
}> {
  const orders = await getAllWorkOrders();
  return {
    pending: orders.filter(o => o.status === ORDER_STATUS.PENDING || o.status === ORDER_STATUS.ASSIGNED).length,
    in_progress: orders.filter(o => o.status === ORDER_STATUS.IN_PROGRESS || o.status === ORDER_STATUS.ACCEPTED || o.status === ORDER_STATUS.IN_TRANSIT).length,
    completed: orders.filter(o => o.status === ORDER_STATUS.COMPLETED).length,
    total: orders.length,
  };
}
