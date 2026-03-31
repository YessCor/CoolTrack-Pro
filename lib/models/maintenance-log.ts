import { z } from 'zod';

export const MaintenanceLogSchema = z.object({
  id: z.string(),
  equipment_id: z.string(),
  work_order_id: z.string().optional(),
  technician_id: z.string(),
  service_type: z.enum(['preventivo', 'correctivo']),
  description: z.string(),
  problem_description: z.string().optional(),
  solution_applied: z.string().optional(),
  labor_hours: z.number().optional(),
  parts_used: z.array(z.object({
    id: z.string(),
    part_number: z.string().optional(),
    name: z.string(),
    quantity: z.number(),
    unit_price: z.number(),
  })).default([]),
  parts_cost: z.number().optional(),
  photos: z.array(z.string()).default([]),
  client_signature: z.string().optional(),
  signature_timestamp: z.string().optional(),
  next_service_date: z.string().optional(),
  notes: z.string().optional(),
  created_at: z.string(),
});

export type MaintenanceLog = z.infer<typeof MaintenanceLogSchema>;

export function createMaintenanceLog(
  data: Omit<MaintenanceLog, 'id' | 'created_at'>
): Omit<MaintenanceLog, 'id'> {
  return {
    ...data,
    created_at: new Date().toISOString(),
  };
}
