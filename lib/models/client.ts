import { z } from 'zod';

export const ClientSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nombre es requerido'),
  contact_name: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  alternate_phone: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  notes: z.string().optional(),
  is_active: z.boolean().default(true),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Client = z.infer<typeof ClientSchema>;

export interface ClientWithStats extends Client {
  equipment_count?: number;
  pending_orders?: number;
}

export function createClient(data: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'is_active'>): Omit<Client, 'id'> {
  const now = new Date().toISOString();
  return {
    ...data,
    is_active: true,
    created_at: now,
    updated_at: now,
  };
}

export function updateClient(client: Client, data: Partial<Omit<Client, 'id' | 'created_at'>>): Client {
  return {
    ...client,
    ...data,
    updated_at: new Date().toISOString(),
  };
}
