import { MaintenanceLog, MaintenanceLogSchema, createMaintenanceLog } from '../models/maintenance-log';
import { getItem, getAll, setItem, generateId } from '../storage';

const ENTITY = 'maintenance_logs';

export async function getMaintenanceLog(id: string): Promise<MaintenanceLog | null> {
  return getItem<MaintenanceLog>(ENTITY, id);
}

export async function getAllMaintenanceLogs(): Promise<MaintenanceLog[]> {
  const logs = await getAll<MaintenanceLog>(ENTITY);
  return logs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getMaintenanceLogsByEquipment(equipmentId: string): Promise<MaintenanceLog[]> {
  const logs = await getAllMaintenanceLogs();
  return logs.filter(l => l.equipment_id === equipmentId);
}

export async function getMaintenanceLogsByTechnician(technicianId: string): Promise<MaintenanceLog[]> {
  const logs = await getAllMaintenanceLogs();
  return logs.filter(l => l.technician_id === technicianId);
}

export async function createMaintenanceLogRepository(
  data: Omit<MaintenanceLog, 'id' | 'created_at'>
): Promise<MaintenanceLog> {
  const logData = createMaintenanceLog(data);
  const log: MaintenanceLog = { ...logData, id: generateId() } as MaintenanceLog;
  
  const parsed = MaintenanceLogSchema.safeParse(log);
  if (!parsed.success) {
    throw new Error(`Invalid maintenance log data: ${parsed.error.message}`);
  }
  
  await setItem(ENTITY, log);
  return log;
}

export async function getMaintenanceHistory(
  equipmentId: string,
  options?: {
    serviceType?: 'preventivo' | 'correctivo';
    startDate?: string;
    endDate?: string;
  }
): Promise<MaintenanceLog[]> {
  let logs = await getMaintenanceLogsByEquipment(equipmentId);
  
  if (options?.serviceType) {
    logs = logs.filter(l => l.service_type === options.serviceType);
  }
  
  if (options?.startDate) {
    const start = new Date(options.startDate);
    logs = logs.filter(l => new Date(l.created_at) >= start);
  }
  
  if (options?.endDate) {
    const end = new Date(options.endDate);
    logs = logs.filter(l => new Date(l.created_at) <= end);
  }
  
  return logs;
}
