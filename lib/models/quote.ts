import { z } from 'zod';
import { QuoteStatus } from '../types';

export const QuoteItemSchema = z.object({
  id: z.string(),
  quote_id: z.string().optional(),
  catalog_item_id: z.string().optional(),
  description: z.string(),
  quantity: z.number().min(1),
  unit_price: z.number().min(0),
  total: z.number().min(0),
});

export type QuoteItem = z.infer<typeof QuoteItemSchema>;

export const QuoteSchema = z.object({
  id: z.string(),
  quote_number: z.number(),
  display_quote_number: z.string().optional(),
  order_id: z.string().optional(),
  client_id: z.string(),
  technician_id: z.string().optional(),
  status: z.enum(['draft', 'sent', 'approved', 'rejected', 'expired']),
  subtotal: z.number().min(0),
  labor_cost: z.number().min(0).default(0),
  parts_cost: z.number().min(0).default(0),
  tax_rate: z.number().min(0).max(1).default(0.16),
  tax_amount: z.number().min(0).default(0),
  total: z.number().min(0),
  labor_hours: z.number().optional(),
  equipment_type: z.string().optional(),
  capacity_category: z.string().optional(),
  valid_until: z.string().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  items: z.array(QuoteItemSchema).default([]),
  email_sent_at: z.string().optional(),
  email_status: z.enum(['pending', 'sent', 'failed']).optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Quote = z.infer<typeof QuoteSchema>;

export const TARIFF_BASE: Record<string, number> = {
  split: 50,
  window: 40,
  central: 80,
  chiller: 150,
  package: 100,
  other: 60,
};

export const CAPACITY_MULTIPLIER: Record<string, number> = {
  small: 1.0,
  medium: 1.5,
  large: 2.0,
};

export const DEFAULT_HOURLY_RATE = 35;

export function calculateQuoteTotal(
  equipmentType: string,
  capacityCategory: string,
  laborHours: number,
  partsCost: number,
  hourlyRate: number = DEFAULT_HOURLY_RATE,
  taxRate: number = 0.16
): { laborCost: number; subtotal: number; taxAmount: number; total: number } {
  const baseRate = TARIFF_BASE[equipmentType] ?? TARIFF_BASE.other;
  const multiplier = CAPACITY_MULTIPLIER[capacityCategory] ?? 1.0;
  const laborCost = laborHours * hourlyRate;
  const subtotal = (baseRate * multiplier) + laborCost + partsCost;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  return {
    laborCost: Math.round(laborCost * 100) / 100,
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

export function createQuote(
  data: Omit<Quote, 'id' | 'quote_number' | 'created_at' | 'updated_at' | 'status' | 'subtotal' | 'labor_cost' | 'parts_cost' | 'tax_amount' | 'total' | 'items'>
): Omit<Quote, 'id' | 'quote_number'> {
  const now = new Date().toISOString();
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 15);

  return {
    ...data,
    status: 'draft',
    subtotal: 0,
    labor_cost: 0,
    parts_cost: 0,
    tax_amount: 0,
    total: 0,
    tax_rate: 0.16,
    items: [],
    valid_until: validUntil.toISOString(),
    created_at: now,
    updated_at: now,
  };
}

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  draft: 'Borrador',
  sent: 'Enviada',
  approved: 'Aprobada',
  rejected: 'Rechazada',
  expired: 'Expirada',
};
