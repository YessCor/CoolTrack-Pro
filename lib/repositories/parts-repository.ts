import { Part, PartSchema, DEFAULT_PARTS_CATALOG } from '../models/part';
import { getItem, getAll, setItem, setAll, generateId } from '../storage';

const ENTITY = 'parts';
const CATALOG_INITIALIZED_KEY = '@cooltrack:parts_catalog_initialized';

export async function getPart(id: string): Promise<Part | null> {
  return getItem<Part>(ENTITY, id);
}

export async function getAllParts(): Promise<Part[]> {
  await ensureCatalogInitialized();
  const parts = await getAll<Part>(ENTITY);
  return parts.filter(p => p.is_active).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPartsByCategory(category: string): Promise<Part[]> {
  const parts = await getAllParts();
  return parts.filter(p => p.category === category);
}

export async function searchParts(term: string): Promise<Part[]> {
  const parts = await getAllParts();
  const lowerTerm = term.toLowerCase();
  return parts.filter(p =>
    p.name.toLowerCase().includes(lowerTerm) ||
    p.part_number?.toLowerCase().includes(lowerTerm) ||
    p.description?.toLowerCase().includes(lowerTerm)
  );
}

export async function createPart(
  data: Omit<Part, 'id' | 'created_at' | 'updated_at' | 'is_active'>
): Promise<Part> {
  const now = new Date().toISOString();
  const part: Part = {
    ...data,
    id: generateId(),
    is_active: true,
    created_at: now,
    updated_at: now,
  };
  
  const parsed = PartSchema.safeParse(part);
  if (!parsed.success) {
    throw new Error(`Invalid part data: ${parsed.error.message}`);
  }
  
  await setItem(ENTITY, part);
  return part;
}

export async function updatePart(
  id: string,
  data: Partial<Omit<Part, 'id' | 'created_at'>>
): Promise<Part | null> {
  const existing = await getPart(id);
  if (!existing) return null;
  
  const updated: Part = {
    ...existing,
    ...data,
    updated_at: new Date().toISOString(),
  };
  
  const parsed = PartSchema.safeParse(updated);
  if (!parsed.success) {
    throw new Error(`Invalid part data: ${parsed.error.message}`);
  }
  
  await setItem(ENTITY, updated);
  return updated;
}

export async function deletePart(id: string): Promise<void> {
  const result = await updatePart(id, { is_active: false });
  if (!result) throw new Error('Part not found');
}

async function ensureCatalogInitialized(): Promise<void> {
  try {
    const initialized = await getItem<{ value: boolean }>(ENTITY, 'catalog_initialized');
    if (initialized?.value) return;
    
    const now = new Date().toISOString();
    const parts: Part[] = DEFAULT_PARTS_CATALOG.map((p, index) => ({
      ...p,
      id: `catalog-${index}`,
      is_active: true,
      created_at: now,
      updated_at: now,
    })) as Part[];
    
    await setAll(ENTITY, parts);
    await setItem(ENTITY, { id: 'catalog_initialized', value: true } as unknown as Part);
  } catch (error) {
    console.error('Error initializing parts catalog:', error);
  }
}
