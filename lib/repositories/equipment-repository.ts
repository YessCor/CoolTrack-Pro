import { Equipment, EquipmentSchema, createEquipment, updateEquipment } from '../models/equipment';
import { getItem, getAll, setItem, removeItem, query, generateId } from '../storage';

const ENTITY = 'equipment';

export async function getEquipment(id: string): Promise<Equipment | null> {
  return getItem<Equipment>(ENTITY, id);
}

export async function getAllEquipment(): Promise<Equipment[]> {
  const equipment = await getAll<Equipment>(ENTITY);
  return equipment.filter(e => e.is_active).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getEquipmentByClient(clientId: string): Promise<Equipment[]> {
  const all = await getAllEquipment();
  return all.filter(e => e.client_id === clientId);
}

export async function createEquipmentRepository(
  data: Omit<Equipment, 'id' | 'created_at' | 'updated_at' | 'is_active' | 'capacity_category' | 'capacity_kw'>
): Promise<Equipment> {
  const equipmentData = createEquipment(data);
  const equipment: Equipment = { ...equipmentData, id: generateId() } as Equipment;
  
  const parsed = EquipmentSchema.safeParse(equipment);
  if (!parsed.success) {
    throw new Error(`Invalid equipment data: ${parsed.error.message}`);
  }
  
  await setItem(ENTITY, equipment);
  return equipment;
}

export async function updateEquipmentRepository(
  id: string,
  data: Partial<Omit<Equipment, 'id' | 'created_at' | 'capacity_category' | 'capacity_kw'>>
): Promise<Equipment | null> {
  const existing = await getEquipment(id);
  if (!existing) return null;
  
  const updated = updateEquipment(existing, data);
  const parsed = EquipmentSchema.safeParse(updated);
  if (!parsed.success) {
    throw new Error(`Invalid equipment data: ${parsed.error.message}`);
  }
  
  await setItem(ENTITY, updated);
  return updated;
}

export async function deleteEquipment(id: string): Promise<void> {
  const existing = await getEquipment(id);
  if (!existing) return;
  await updateEquipmentRepository(id, { is_active: false });
}

export async function searchEquipment(term: string): Promise<Equipment[]> {
  const equipment = await getAllEquipment();
  const lowerTerm = term.toLowerCase();
  return equipment.filter(e =>
    e.name.toLowerCase().includes(lowerTerm) ||
    e.brand?.toLowerCase().includes(lowerTerm) ||
    e.model?.toLowerCase().includes(lowerTerm) ||
    e.serial_number?.toLowerCase().includes(lowerTerm)
  );
}
