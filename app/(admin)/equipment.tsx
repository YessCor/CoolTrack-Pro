import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AirVentIcon, PlusIcon, ChevronRightIcon, MapPinIcon, ClipboardIcon, UserIcon } from '../../components/ui/Icons';
import { useAuth } from '../../context/AuthContext';

const EQUIPMENT_TYPE_LABELS: Record<string, string> = {
  split: 'Aire de ventana',
  window: 'Ventana',
  central: 'Sistema Central',
  mini_split: 'Minisplit',
  chiller: 'Chiller',
  fan_coil: 'Fan Coil',
  package: 'Paquete',
  other: 'Otro',
};

interface EquipmentItem {
  id: string;
  client_id: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  serial_number: string;
  capacity_tons: number;
  location_description: string;
  client_name: string;
  client_email: string;
  service_count: string;
  last_service: string;
}

export default function AdminEquipment() {
  const router = useRouter();
  const { user } = useAuth();

  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEquipment = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/admin/equipment?user_id=${user.id}&role=admin`);
      const data = await res.json();
      if (data.success) {
        setEquipment(data.equipment || []);
      } else {
        console.error('API error:', data.error);
      }
    } catch (error) {
      console.error('Error loading equipment:', error);
      Alert.alert('Error', 'No se pudieron cargar los equipos');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadEquipment();
  }, [loadEquipment]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEquipment();
    setRefreshing(false);
  };

  const handleDelete = (item: EquipmentItem) => {
    Alert.alert(
      'Eliminar equipo',
      `¿Está seguro de eliminar "${item.name || item.type}" del cliente ${item.client_name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`/api/admin/equipment?role=admin&id=${item.id}`, {
                method: 'DELETE',
              });
              const data = await res.json();
              if (data.success) {
                await loadEquipment();
              } else {
                Alert.alert('Error', data.error || 'No se pudo eliminar el equipo');
              }
            } catch (error) {
              console.error('Error deleting equipment:', error);
              Alert.alert('Error', 'No se pudo eliminar el equipo');
            }
          },
        },
      ]
    );
  };

  const navigateToEquipment = (item: EquipmentItem) => {
    router.push({
      pathname: '/(admin)/equipment/[id]',
      params: { id: item.id, client_id: item.client_id },
    } as any);
  };

  const navigateToNewEquipment = () => {
    router.push({ pathname: '/(admin)/equipment/new', params: {} } as any);
  };

  const renderEquipment = ({ item }: { item: EquipmentItem }) => (
    <TouchableOpacity
      style={styles.equipmentCard}
      onPress={() => navigateToEquipment(item)}
      onLongPress={() => handleDelete(item)}
    >
      <View style={styles.equipmentRow}>
        <View style={styles.equipmentIcon}>
          <AirVentIcon size={24} color="#0F4C75" />
        </View>
        <View style={styles.equipmentInfo}>
          <Text style={styles.equipmentName}>
            {item.name || EQUIPMENT_TYPE_LABELS[item.type] || 'Equipo'}
          </Text>
          <Text style={styles.equipmentType}>
            {EQUIPMENT_TYPE_LABELS[item.type] || item.type}
            {item.brand && ` • ${item.brand}`}
          </Text>
          {item.location_description && (
            <View style={styles.locationRow}>
              <MapPinIcon size={11} color="#94a3b8" />
              <Text style={styles.locationText}>{item.location_description}</Text>
            </View>
          )}
          <View style={styles.clientRow}>
            <UserIcon size={11} color="#00B4D8" />
            <Text style={styles.clientText}>{item.client_name}</Text>
          </View>
        </View>
        <View style={styles.rightSection}>
          {item.service_count && parseInt(item.service_count) > 0 && (
            <View style={styles.serviceBadge}>
              <ClipboardIcon size={10} color="#0F4C75" />
              <Text style={styles.serviceCount}>{item.service_count}</Text>
            </View>
          )}
          <ChevronRightIcon size={18} color="#CBD5E1" />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0F4C75" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={navigateToNewEquipment}>
        <PlusIcon size={20} color="#fff" />
        <Text style={styles.addButtonText}>Nuevo Equipo</Text>
      </TouchableOpacity>

      <FlatList
        data={equipment}
        keyExtractor={item => item.id}
        renderItem={renderEquipment}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0F4C75" />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AirVentIcon size={64} color="#E2E8F0" />
            <Text style={styles.emptyTitle}>Sin equipos</Text>
            <Text style={styles.emptyText}>
              Aún no hay equipos registrados. Toca el botón de arriba para agregar el primero.
            </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0F4C75',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
    gap: 12,
  },
  equipmentCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  equipmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  equipmentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E8F4FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  equipmentInfo: {
    flex: 1,
    gap: 3,
  },
  equipmentName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0D1B2A',
  },
  equipmentType: {
    fontSize: 12,
    color: '#64748b',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  clientText: {
    fontSize: 11,
    color: '#00B4D8',
    fontWeight: '600',
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 8,
  },
  serviceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#E8F4FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  serviceCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F4C75',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 64,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#64748b',
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
});
