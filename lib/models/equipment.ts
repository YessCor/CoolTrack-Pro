import { z } from 'zod';

export const EquipmentTypeSchema = z.enum(['split', 'window', 'central', 'chiller', 'package', 'other']);
export type EquipmentType = z.infer<typeof EquipmentTypeSchema>;

export const CapacityCategorySchema = z.enum(['small', 'medium', 'large']);
export type CapacityCategory = z.infer<typeof CapacityCategorySchema>;

export const EquipmentSchema = z.object({
  id: z.string(),
  client_id: z.string(),
  name: z.string().min(1, 'Nombre es requerido'),
  type: EquipmentTypeSchema,
  brand: z.string().optional(),
  model: z.string().optional(),
  serial_number: z.string().optional(),
  capacity_btu: z.number().optional(),
  capacity_kw: z.number().optional(),
  capacity_category: CapacityCategorySchema.optional(),
  refrigerant_type: z.string().optional(),
  power_requirements: z.string().optional(),
  location_description: z.string().optional(),
  installation_date: z.string().optional(),
  warranty_expires: z.string().optional(),
  notes: z.string().optional(),
  is_active: z.boolean().default(true),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Equipment = z.infer<typeof EquipmentSchema>;

export function calculateCapacityCategory(btu: number | undefined): CapacityCategory | undefined {
  if (!btu) return undefined;
  if (btu < 12000) return 'small';
  if (btu <= 24000) return 'medium';
  return 'large';
}

export function calculateCapacityKw(btu: number | undefined): number | undefined {
  if (!btu) return undefined;
  return Math.round(btu * 0.000293071 * 100) / 100;
}

export function createEquipment(
  data: Omit<Equipment, 'id' | 'created_at' | 'updated_at' | 'is_active' | 'capacity_category' | 'capacity_kw'>
): Omit<Equipment, 'id'> {
  const now = new Date().toISOString();
  const capacity_btu = data.capacity_btu;
  return {
    ...data,
    capacity_category: calculateCapacityCategory(capacity_btu),
    capacity_kw: calculateCapacityKw(capacity_btu),
    is_active: true,
    created_at: now,
    updated_at: now,
  };
}

export function updateEquipment(
  equipment: Equipment,
  data: Partial<Omit<Equipment, 'id' | 'created_at' | 'capacity_category' | 'capacity_kw'>>
): Equipment {
  const capacity_btu = data.capacity_btu ?? equipment.capacity_btu;
  return {
    ...equipment,
    ...data,
    capacity_category: calculateCapacityCategory(capacity_btu),
    capacity_kw: calculateCapacityKw(capacity_btu),
    updated_at: new Date().toISOString(),
  };
}

export const EQUIPMENT_TYPE_LABELS: Record<EquipmentType, string> = {
  split: 'Split',
  window: 'Ventana',
  central: 'Central',
  chiller: 'Chiller',
  package: 'Paquete',
  other: 'Otro',
};

export const CAPACITY_CATEGORY_LABELS: Record<CapacityCategory, string> = {
  small: 'Pequeño (<12,000 BTU)',
  medium: 'Mediano (12,000-24,000 BTU)',
  large: 'Grande (>24,000 BTU)',
};
