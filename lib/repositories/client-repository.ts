import { Client, ClientSchema, createClient, updateClient, ClientWithStats } from '../models/client';
import { Equipment } from '../models/equipment';
import { getItem, getAll, setItem, removeItem, query, generateId } from '../storage';

const ENTITY = 'clients';

export async function getClient(id: string): Promise<Client | null> {
  return getItem<Client>(ENTITY, id);
}

export async function getAllClients(): Promise<Client[]> {
  const clients = await getAll<Client>(ENTITY);
  return clients.filter(c => c.is_active).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getClientsWithStats(): Promise<ClientWithStats[]> {
  const clients = await getAllClients();
  const { getAllEquipment } = await import('./equipment-repository');
  const { getAllWorkOrders } = await import('./work-order-repository');
  
  const equipment = await getAllEquipment();
  const orders = await getAllWorkOrders();
  
  return clients.map(client => ({
    ...client,
    equipment_count: equipment.filter((e: Equipment) => e.client_id === client.id && e.is_active).length,
    pending_orders: orders.filter((o: any) => o.client_id === client.id && o.status !== 'completed' && o.status !== 'cancelled').length,
  }));
}

export async function createClientRepository(
  data: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'is_active'>
): Promise<Client> {
  const clientData = createClient(data);
  const client: Client = { ...clientData, id: generateId() } as Client;
  
  const parsed = ClientSchema.safeParse(client);
  if (!parsed.success) {
    throw new Error(`Invalid client data: ${parsed.error.message}`);
  }
  
  await setItem(ENTITY, client);
  return client;
}

export async function updateClientRepository(
  id: string,
  data: Partial<Omit<Client, 'id' | 'created_at'>>
): Promise<Client | null> {
  const existing = await getClient(id);
  if (!existing) return null;
  
  const updated = updateClient(existing, data);
  const parsed = ClientSchema.safeParse(updated);
  if (!parsed.success) {
    throw new Error(`Invalid client data: ${parsed.error.message}`);
  }
  
  await setItem(ENTITY, updated);
  return updated;
}

export async function deleteClient(id: string): Promise<void> {
  const existing = await getClient(id);
  if (!existing) return;
  await updateClientRepository(id, { is_active: false });
}

export async function searchClients(term: string): Promise<Client[]> {
  const clients = await getAllClients();
  const lowerTerm = term.toLowerCase();
  return clients.filter(c =>
    c.name.toLowerCase().includes(lowerTerm) ||
    c.email?.toLowerCase().includes(lowerTerm) ||
    c.phone?.includes(term) ||
    c.address?.toLowerCase().includes(lowerTerm)
  );
}
