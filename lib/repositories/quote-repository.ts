import { Quote, QuoteSchema, QuoteItem, createQuote, calculateQuoteTotal } from '../models/quote';
import { getItem, getAll, setItem, generateId } from '../storage';

const ENTITY = 'quotes';

export async function getQuote(id: string): Promise<Quote | null> {
  return getItem<Quote>(ENTITY, id);
}

export async function getAllQuotes(): Promise<Quote[]> {
  const quotes = await getAll<Quote>(ENTITY);
  return quotes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getQuotesByClient(clientId: string): Promise<Quote[]> {
  const quotes = await getAllQuotes();
  return quotes.filter(q => q.client_id === clientId);
}

export async function getQuotesByStatus(status: Quote['status']): Promise<Quote[]> {
  const quotes = await getAllQuotes();
  return quotes.filter(q => q.status === status);
}

export async function createQuoteRepository(
  data: Omit<Quote, 'id' | 'quote_number' | 'created_at' | 'updated_at' | 'status' | 'subtotal' | 'labor_cost' | 'parts_cost' | 'tax_amount' | 'total' | 'items'>
): Promise<Quote> {
  const quoteData = createQuote(data);
  const id = generateId();
  const quote: Quote = {
    ...quoteData,
    id,
    quote_number: Date.now(),
  } as Quote;
  
  const parsed = QuoteSchema.safeParse(quote);
  if (!parsed.success) {
    throw new Error(`Invalid quote data: ${parsed.error.message}`);
  }
  
  await setItem(ENTITY, quote);
  return quote;
}

export async function updateQuoteRepository(
  id: string,
  data: Partial<Quote>
): Promise<Quote | null> {
  const existing = await getQuote(id);
  if (!existing) return null;
  
  const updated: Quote = { ...existing, ...data, updated_at: new Date().toISOString() } as Quote;
  const parsed = QuoteSchema.safeParse(updated);
  if (!parsed.success) {
    throw new Error(`Invalid quote data: ${parsed.error.message}`);
  }
  
  await setItem(ENTITY, updated);
  return updated;
}

export async function calculateQuote(id: string): Promise<Quote | null> {
  const quote = await getQuote(id);
  if (!quote) return null;
  
  const partsCost = quote.items?.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0) ?? 0;
  const calculated = calculateQuoteTotal(
    quote.equipment_type ?? 'other',
    quote.capacity_category ?? 'medium',
    quote.labor_hours ?? 0,
    partsCost,
    35,
    quote.tax_rate ?? 0.16
  );
  
  return updateQuoteRepository(id, {
    parts_cost: partsCost,
    labor_cost: calculated.laborCost,
    subtotal: calculated.subtotal,
    tax_amount: calculated.taxAmount,
    total: calculated.total,
  });
}

export async function addQuoteItem(
  quoteId: string,
  item: Omit<QuoteItem, 'id' | 'quote_id'>
): Promise<Quote | null> {
  const quote = await getQuote(quoteId);
  if (!quote) return null;
  
  const newItem: QuoteItem = {
    ...item,
    id: generateId(),
    quote_id: quoteId,
  };
  
  const items = [...(quote.items ?? []), newItem];
  return updateQuoteRepository(quoteId, { items });
}

export async function removeQuoteItem(
  quoteId: string,
  itemId: string
): Promise<Quote | null> {
  const quote = await getQuote(quoteId);
  if (!quote) return null;
  
  const items = (quote.items ?? []).filter(i => i.id !== itemId);
  return updateQuoteRepository(quoteId, { items });
}

export async function sendQuoteEmail(id: string): Promise<Quote | null> {
  return updateQuoteRepository(id, {
    status: 'sent',
    email_sent_at: new Date().toISOString(),
    email_status: 'sent',
  });
}

export async function approveQuote(id: string): Promise<Quote | null> {
  return updateQuoteRepository(id, { status: 'approved' });
}

export async function rejectQuote(id: string): Promise<Quote | null> {
  return updateQuoteRepository(id, { status: 'rejected' });
}
