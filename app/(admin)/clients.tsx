import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { UserIcon, PlusIcon, ChevronRightIcon, PhoneIcon, MailIcon } from '../../components/ui/Icons';
import { getClientsWithStats, deleteClient } from '../../lib/repositories/client-repository';
import { ClientWithStats } from '../../lib/models/client';
import { useAuth } from '../../context/AuthContext';

export default function AdminClients() {
  const router = useRouter();
  const { user } = useAuth();

  const navigateToClient = (id: string) => {
    router.push({ pathname: '/(admin)/client/[id]', params: { id } } as any);
  };

  const navigateToNewClient = () => {
    router.push({ pathname: '/(admin)/client/new', params: {} } as any);
  };

  const [clients, setClients] = useState<ClientWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadClients = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await getClientsWithStats(user.id, user.role || 'admin');
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
      Alert.alert('Error', 'No se pudieron cargar los clientes');
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.role]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadClients();
    setRefreshing(false);
  };

  const handleDelete = (client: ClientWithStats) => {
    Alert.alert(
      'Eliminar cliente',
      `¿Está seguro de eliminar "${client.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteClient(client.id, user?.id || '');
              await loadClients();
            } catch (error) {
              console.error('Error deleting client:', error);
              Alert.alert('Error', 'No se pudo eliminar el cliente');
            }
          },
        },
      ]
    );
  };

  const renderClient = ({ item }: { item: ClientWithStats }) => (
    <TouchableOpacity
      style={styles.clientCard}
      onPress={() => navigateToClient(item.id)}
      onLongPress={() => handleDelete(item)}
    >
      <View style={styles.avatar}>
        <UserIcon size={22} color="#0F4C75" />
      </View>
      <View style={styles.clientInfo}>
        <Text style={styles.clientName}>{item.name}</Text>
        {item.email && (
          <View style={styles.contactRow}>
            <MailIcon size={12} color="#64748b" />
            <Text style={styles.contactText}>{item.email}</Text>
          </View>
        )}
        {item.phone && (
          <View style={styles.contactRow}>
            <PhoneIcon size={12} color="#64748b" />
            <Text style={styles.contactText}>{item.phone}</Text>
          </View>
        )}
        <View style={styles.statsRow}>
          <View style={styles.statBadge}>
            <Text style={styles.statText}>{item.equipment_count || 0} equipos</Text>
          </View>
          <View style={[styles.statBadge, item.pending_orders ? styles.statBadgeActive : null]}>
            <Text style={[styles.statText, item.pending_orders ? styles.statTextActive : null]}>
              {item.pending_orders || 0} órdenes
            </Text>
          </View>
        </View>
      </View>
      <ChevronRightIcon size={20} color="#CBD5E1" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {clients.length} cliente{clients.length !== 1 ? 's' : ''} registrado{clients.length !== 1 ? 's' : ''}
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={navigateToNewClient}
        >
          <PlusIcon size={18} color="#fff" />
          <Text style={styles.addButtonText}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={clients}
        keyExtractor={item => item.id}
        renderItem={renderClient}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0F4C75']}
            tintColor="#0F4C75"
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No hay clientes registrados</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={navigateToNewClient}
            >
              <Text style={styles.emptyButtonText}>Agregar primer cliente</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F4C75',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F4FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientInfo: {
    flex: 1,
    gap: 4,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D1B2A',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contactText: {
    fontSize: 12,
    color: '#64748b',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  statBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
  },
  statBadgeActive: {
    backgroundColor: '#FEF3C7',
  },
  statText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  statTextActive: {
    color: '#D97706',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 16,
  },
  emptyText: {
    fontSize: 15,
    color: '#94a3b8',
  },
  emptyButton: {
    backgroundColor: '#0F4C75',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
