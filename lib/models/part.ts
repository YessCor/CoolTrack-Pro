import { z } from 'zod';

export const PartCategorySchema = z.enum([
  'filters',
  'coils',
  'compressors',
  'refrigerants',
  'electrical',
  'motors',
  'capacitors',
  'controles',
  'tuberias',
  'other',
]);
export type PartCategory = z.infer<typeof PartCategorySchema>;

export const PartSchema = z.object({
  id: z.string(),
  part_number: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  category: PartCategorySchema,
  unit_price: z.number().min(0),
  unit: z.string().default('unidad'),
  is_active: z.boolean().default(true),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Part = z.infer<typeof PartSchema>;

export const PART_CATEGORY_LABELS: Record<PartCategory, string> = {
  filters: 'Filtros',
  coils: 'Bobinas',
  compressors: 'Compresores',
  refrigerants: 'Refrigerantes',
  electrical: 'Eléctricos',
  motors: 'Motores',
  capacitors: 'Capacitores',
  controles: 'Controles',
  tuberias: 'Tuberías',
  other: 'Otros',
};

export const DEFAULT_PARTS_CATALOG = [
  { part_number: 'FIL-001', name: 'Filtro de aire estándar 20x25', category: 'filters', unit_price: 15, unit: 'unidad' },
  { part_number: 'FIL-002', name: 'Filtro de aire 16x20', category: 'filters', unit_price: 12, unit: 'unidad' },
  { part_number: 'FIL-003', name: 'Filtro HEPA', category: 'filters', unit_price: 45, unit: 'unidad' },
  { part_number: 'REF-001', name: 'Refrigerante R-410A 500g', category: 'refrigerants', unit_price: 85, unit: 'lb' },
  { part_number: 'REF-002', name: 'Refrigerante R-22 500g', category: 'refrigerants', unit_price: 120, unit: 'lb' },
  { part_number: 'REF-003', name: 'Refrigerante R-134a 500g', category: 'refrigerants', unit_price: 65, unit: 'lb' },
  { part_number: 'CAP-001', name: 'Capacitor 35/5 MFD', category: 'capacitors', unit_price: 25, unit: 'unidad' },
  { part_number: 'CAP-002', name: 'Capacitor 45/5 MFD', category: 'capacitors', unit_price: 28, unit: 'unidad' },
  { part_number: 'CAP-003', name: 'Capacitor 70/5 MFD', category: 'capacitors', unit_price: 32, unit: 'unidad' },
  { part_number: 'MOT-001', name: 'Motor de ventilador 1/4 HP', category: 'motors', unit_price: 95, unit: 'unidad' },
  { part_number: 'MOT-002', name: 'Motor de ventilador 1/3 HP', category: 'motors', unit_price: 110, unit: 'unidad' },
  { part_number: 'MOT-003', name: 'Motor de compresor 2HP', category: 'motors', unit_price: 350, unit: 'unidad' },
  { part_number: 'ELC-001', name: 'Contactor 30A', category: 'electrical', unit_price: 35, unit: 'unidad' },
  { part_number: 'ELC-002', name: 'Termostato digital', category: 'electrical', unit_price: 65, unit: 'unidad' },
  { part_number: 'ELC-003', name: 'Sensor de temperatura', category: 'electrical', unit_price: 28, unit: 'unidad' },
  { part_number: 'COO-001', name: 'Bobina evaporadora', category: 'coils', unit_price: 280, unit: 'unidad' },
  { part_number: 'COO-002', name: 'Bobina condensadora', category: 'coils', unit_price: 320, unit: 'unidad' },
  { part_number: 'TUB-001', name: 'Tubo de cobre 1/4" x 50ft', category: 'tuberias', unit_price: 45, unit: 'rollo' },
  { part_number: 'TUB-002', name: 'Tubo de cobre 3/8" x 50ft', category: 'tuberias', unit_price: 55, unit: 'rollo' },
  { part_number: 'CON-001', name: 'Placa de control', category: 'controles', unit_price: 85, unit: 'unidad' },
];
