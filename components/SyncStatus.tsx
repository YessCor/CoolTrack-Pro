import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CloudIcon, CloudOffIcon, RefreshIcon } from './ui/Icons';
import { initNetworkListener, syncNow, getNetworkStatus, getPendingSyncCount } from '../lib/services/sync-service';

interface SyncStatusProps {
  showLabel?: boolean;
  onSyncComplete?: (result: { success: number; failed: number }) => void;
}

export function SyncStatus({ showLabel = true, onSyncComplete }: SyncStatusProps) {
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline' | 'unknown'>('unknown');
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    let mounted = true;

    initNetworkListener(
      (status) => {
        if (!mounted) return;
        setNetworkStatus(status);
        if (status === 'online' && pendingCount > 0) {
          handleSync();
        }
      },
      () => {
        if (mounted && networkStatus === 'online' && pendingCount > 0) {
          handleSync();
        }
      }
    ).then(unsubscribe => {
      if (!mounted) {
        unsubscribe();
        return;
      }
      setPendingCount(getPendingSyncCount());
      setNetworkStatus(getNetworkStatus());

      const interval = setInterval(() => {
        if (mounted) {
          setPendingCount(getPendingSyncCount());
        }
      }, 5000);

      return () => {
        unsubscribe();
        clearInterval(interval);
      };
    }).catch(console.error);

    return () => {
      mounted = false;
    };
  }, [networkStatus, pendingCount]);

  const handleSync = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    try {
      const result = await syncNow();
      setPendingCount(getPendingSyncCount());
      onSyncComplete?.(result);
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const isOnline = networkStatus === 'online';
  const hasPending = pendingCount > 0;

  const getStatusColor = () => {
    if (!isOnline) return '#EF4444';
    if (hasPending) return '#F59E0B';
    return '#10B981';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Sin conexión';
    if (isSyncing) return 'Sincronizando...';
    if (hasPending) return `${pendingCount} pendiente${pendingCount > 1 ? 's' : ''}`;
    return 'Sincronizado';
  };

  return (
    <View style={styles.container}>
      <View style={[styles.indicator, { backgroundColor: getStatusColor() }]}>
        {isSyncing ? (
          <RefreshIcon size={14} color="#fff" />
        ) : isOnline ? (
          <CloudIcon size={14} color="#fff" />
        ) : (
          <CloudOffIcon size={14} color="#fff" />
        )}
      </View>
      {showLabel && (
        <Text style={[styles.label, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
      )}
      {isOnline && hasPending && !isSyncing && (
        <TouchableOpacity style={styles.syncButton} onPress={handleSync}>
          <RefreshIcon size={16} color="#0F4C75" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  indicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  syncButton: {
    padding: 4,
  },
});
