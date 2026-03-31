import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_PREFIX = '@cooltrack:';

export async function getStorageKey(entity: string): Promise<string> {
  return `${STORAGE_PREFIX}${entity}`;
}

export async function getItem<T>(entity: string, id: string): Promise<T | null> {
  const key = await getStorageKey(entity);
  const data = await AsyncStorage.getItem(key);
  if (!data) return null;
  const items = JSON.parse(data) as Record<string, T>;
  return items[id] ?? null;
}

export async function getAll<T>(entity: string): Promise<T[]> {
  const key = await getStorageKey(entity);
  const data = await AsyncStorage.getItem(key);
  if (!data) return [];
  const items = JSON.parse(data) as Record<string, T>;
  return Object.values(items);
}

export async function setItem<T extends { id: string }>(entity: string, item: T): Promise<void> {
  const key = await getStorageKey(entity);
  const data = await AsyncStorage.getItem(key);
  const items = data ? (JSON.parse(data) as Record<string, T>) : {};
  items[item.id] = item;
  await AsyncStorage.setItem(key, JSON.stringify(items));
}

export async function setAll<T extends { id: string }>(entity: string, items: T[]): Promise<void> {
  const key = await getStorageKey(entity);
  const record: Record<string, T> = {};
  items.forEach(item => { record[item.id] = item; });
  await AsyncStorage.setItem(key, JSON.stringify(record));
}

export async function removeItem(entity: string, id: string): Promise<void> {
  const key = await getStorageKey(entity);
  const data = await AsyncStorage.getItem(key);
  if (!data) return;
  const items = JSON.parse(data) as Record<string, unknown>;
  delete items[id];
  await AsyncStorage.setItem(key, JSON.stringify(items));
}

export async function query<T>(
  entity: string,
  predicate: (item: T) => boolean
): Promise<T[]> {
  const items = await getAll<T>(entity);
  return items.filter(predicate);
}

export async function updateItem<T extends { id: string; updated_at?: string }>(
  entity: string,
  id: string,
  updates: Partial<T>
): Promise<T | null> {
  const item = await getItem<T>(entity, id);
  if (!item) return null;
  const updated = { ...item, ...updates, updated_at: new Date().toISOString() };
  await setItem(entity, updated as T);
  return updated as T;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}
