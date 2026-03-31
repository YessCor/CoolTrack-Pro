import { Client, ClientSchema, createClient, updateClient, ClientWithStats } from '../models/client';
import { apiCall } from '../api';

export async function getClient(id: string, userId: string, role: string): Promise<Client | null> {
  const res = await apiCall(`/api/admin/clients?user_id=${userId}&role=${role}&id=${id}`);
  if (res.success && res.data && (res.data as any).clients && (res.data as any).clients.length > 0) {
    return (res.data as any).clients.find((c: any) => c.id === id) || null;
  }
  return null;
}

export async function getAllClients(): Promise<Client[]> {
  return [];
}

export async function getClientsWithStats(userId: string, role: string): Promise<ClientWithStats[]> {
  const { success, data, error } = await apiCall(`/api/admin/clients?user_id=${userId}&role=${role}`);
  if (success && data && (data as any).clients) {
    return (data as any).clients;
  }
  console.error('Error fetching clients:', error);
  return [];
}

export async function createClientRepository(
  data: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'is_active'>,
  adminId: string
): Promise<Client> {
  const { success, data: res, error } = await apiCall(`/api/admin/clients?admin_id=${adminId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (success && res && (res as any).client) {
    return (res as any).client;
  }
  throw new Error(error || 'Error creating client');
}

export async function updateClientRepository(
  id: string,
  data: Partial<Omit<Client, 'id' | 'created_at'>>
): Promise<Client | null> {
  return null;
}

export async function deleteClient(id: string, userId: string): Promise<void> {
  await apiCall(`/api/admin/clients/${id}?user_id=${userId}`, { method: 'DELETE' });
}

export async function searchClients(term: string): Promise<Client[]> {
  return [];
}
