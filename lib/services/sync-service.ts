import NetInfo from '@react-native-community/netinfo';

export type NetworkStatus = 'online' | 'offline' | 'unknown';

export interface SyncQueueItem {
  id: string;
  entity: string;
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: string;
  retries: number;
}

let networkStatus: NetworkStatus = 'unknown';
let syncQueue: SyncQueueItem[] = [];
let isSyncing = false;

export function getNetworkStatus(): NetworkStatus {
  return networkStatus;
}

export function getSyncQueue(): SyncQueueItem[] {
  return [...syncQueue];
}

export function getPendingSyncCount(): number {
  return syncQueue.length;
}

export function isOnline(): boolean {
  return networkStatus === 'online';
}

export async function initNetworkListener(
  onStatusChange: (status: NetworkStatus) => void,
  onSyncTriggered: () => void
): Promise<() => void> {
  const unsubscribe = NetInfo.addEventListener(state => {
    const newStatus: NetworkStatus = state.isConnected ? 'online' : 'offline';
    
    if (newStatus !== networkStatus) {
      networkStatus = newStatus;
      onStatusChange(newStatus);
      
      if (newStatus === 'online' && syncQueue.length > 0) {
        onSyncTriggered();
      }
    }
  });

  const state = await NetInfo.fetch();
  networkStatus = state.isConnected ? 'online' : 'offline';
  onStatusChange(networkStatus);

  return unsubscribe;
}

export function addToSyncQueue(
  entity: string,
  action: 'create' | 'update' | 'delete',
  data: any
): SyncQueueItem {
  const item: SyncQueueItem = {
    id: `sync-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    entity,
    action,
    data,
    timestamp: new Date().toISOString(),
    retries: 0,
  };
  
  syncQueue.push(item);
  saveSyncQueue();
  return item;
}

export function removeFromSyncQueue(id: string): void {
  syncQueue = syncQueue.filter(item => item.id !== id);
  saveSyncQueue();
}

export function clearSyncQueue(): void {
  syncQueue = [];
  saveSyncQueue();
}

async function saveSyncQueue(): Promise<void> {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    await AsyncStorage.setItem('@cooltrack:sync_queue', JSON.stringify(syncQueue));
  } catch (error) {
    console.error('Error saving sync queue:', error);
  }
}

export async function loadSyncQueue(): Promise<void> {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const saved = await AsyncStorage.getItem('@cooltrack:sync_queue');
    if (saved) {
      syncQueue = JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading sync queue:', error);
  }
}

export async function syncNow(): Promise<{ success: number; failed: number }> {
  if (isSyncing || !isOnline()) {
    return { success: 0, failed: 0 };
  }
  
  isSyncing = true;
  let success = 0;
  let failed = 0;
  
  const itemsToSync = [...syncQueue];
  
  for (const item of itemsToSync) {
    try {
      await syncItem(item);
      removeFromSyncQueue(item.id);
      success++;
    } catch (error) {
      console.error(`Sync failed for ${item.entity}/${item.id}:`, error);
      item.retries++;
      
      if (item.retries >= 3) {
        removeFromSyncQueue(item.id);
        failed++;
      } else {
        saveSyncQueue();
      }
    }
  }
  
  isSyncing = false;
  return { success, failed };
}

async function syncItem(item: SyncQueueItem): Promise<void> {
  const endpoint = `/api/sync/${item.entity}`;
  
  const response = await fetch(endpoint, {
    method: item.action === 'delete' ? 'DELETE' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: item.action,
      data: item.data,
      timestamp: item.timestamp,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Sync failed with status ${response.status}`);
  }
}
