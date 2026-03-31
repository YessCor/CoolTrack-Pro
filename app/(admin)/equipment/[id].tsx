import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeftIcon,
  AirVentIcon,
  MapPinIcon,
  ClipboardIcon,
  UserIcon,
  CalendarIcon,
  CheckCircleIcon,
  WrenchIcon,
  EditIcon,
  TrashIcon,
} from '../../../components/ui/Icons';
import { useAuth } from '../../../context/AuthContext';

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

const STATUS_CONFIG: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#FEF3C7', text: '#D97706' },
  assigned: { bg: '#DBEAFE', text: '#2563EB' },
  accepted: { bg: '#DBEAFE', text: '#2563EB' },
  in_transit: { bg: '#E0E7FF', text: '#4F46E5' },
  in_progress: { bg: '#D1FAE5', text: '#059669' },
  completed: { bg: '#ECFDF5', text: '#10B981' },
  cancelled: { bg: '#FEE2E2', text: '#DC2626' },
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  assigned: 'Asignado',
  accepted: 'Aceptado',
  in_transit: 'En camino',
  in_progress: 'En progreso',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

interface EquipmentDetail {
  id: string;
  client_id: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  serial_number: string;
  capacity_tons: number;
  location_description: string;
  notes: string;
  client_name: string;
  client_email: string;
  service_history: any[];
}

export default function AdminEquipmentDetail() {
  const router = useRouter();
  const { user } = useAuth();
  const { id, client_id } = useLocalSearchParams<{ id: string; client_id: string }>();

  const [equipment, setEquipment] = useState<EquipmentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && client_id) loadData();
  }, [id, client_id]);

  const loadData = async () => {
    if (!user?.id || !client_id) return;
    try {
      const res = await fetch(`/api/admin/equipment?user_id=${user.id}&role=admin&client_id=${client_id}`);
      const data = await res.json();
      if (data.success) {
        const found = data.equipment?.find((e: any) => e.id === id);
        setEquipment(found || null);
      }
    } catch (error) {
      console.error('Error loading equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (!equipment) return;
    router.push({
      pathname: '/(admin)/equipment/new',
      params: {
        mode: 'edit',
        id: String(equipment.id).replace(/::uuid$/, ''),
        client_id: String(equipment.client_id).replace(/::uuid$/, ''),
        name: equipment.name || '',
        type: equipment.type || '',
        brand: equipment.brand || '',
        model: equipment.model || '',
        serial_number: equipment.serial_number || '',
        capacity_tons: equipment.capacity_tons ? String(equipment.capacity_tons) : '',
        location_description: equipment.location_description || '',
        notes: equipment.notes || '',
      },
    } as any);
  };

  const handleDelete = () => {
    if (!equipment) return;
    Alert.alert(
      'Eliminar equipo',
      `¿Está seguro de eliminar "${equipment.name || equipment.type}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`/api/admin/equipment?role=admin&id=${equipment.id}`, {
                method: 'DELETE',
              });
              const data = await res.json();
              if (data.success) {
                router.back();
              } else {
                Alert.alert('Error', data.error || 'No se pudo eliminar');
              }
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el equipo');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0F4C75" />
      </View>
    );
  }

  if (!equipment) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Equipo no encontrado</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const serviceHistory = equipment.service_history || [];
  const completedCount = serviceHistory.filter((s: any) => s.status === 'completed').length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
          <ArrowLeftIcon size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Equipo</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity onPress={handleEdit} style={styles.headerAction}>
            <EditIcon size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.headerAction}>
            <TrashIcon size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View style={styles.equipmentCard}>
          <View style={styles.equipmentHeader}>
            <View style={styles.equipmentIcon}>
              <AirVentIcon size={32} color="#0F4C75" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.equipmentName}>
                {equipment.name || EQUIPMENT_TYPE_LABELS[equipment.type] || 'Equipo'}
              </Text>
              <Text style={styles.equipmentType}>
                {EQUIPMENT_TYPE_LABELS[equipment.type] || equipment.type}
              </Text>
            </View>
          </View>

          <View style={styles.clientBadge}>
            <UserIcon size={14} color="#00B4D8" />
            <Text style={styles.clientBadgeText}>{equipment.client_name}</Text>
          </View>

          <View style={styles.specsGrid}>
            {equipment.brand && (
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Marca</Text>
                <Text style={styles.specValue}>{equipment.brand}</Text>
              </View>
            )}
            {equipment.model && (
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Modelo</Text>
                <Text style={styles.specValue}>{equipment.model}</Text>
              </View>
            )}
            {equipment.serial_number && (
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Serie</Text>
                <Text style={styles.specValue}>{equipment.serial_number}</Text>
              </View>
            )}
            {equipment.capacity_tons && (
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Capacidad</Text>
                <Text style={styles.specValue}>{equipment.capacity_tons} tons</Text>
              </View>
            )}
          </View>

          {equipment.location_description && (
            <View style={styles.locationRow}>
              <MapPinIcon size={14} color="#64748b" />
              <Text style={styles.locationLabel}>Ubicación:</Text>
              <Text style={styles.locationValue}>{equipment.location_description}</Text>
            </View>
          )}

          {equipment.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.notesLabel}>Notas</Text>
              <Text style={styles.notesText}>{equipment.notes}</Text>
            </View>
          )}

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <ClipboardIcon size={20} color="#0F4C75" />
              <Text style={styles.statNumber}>{serviceHistory.length}</Text>
              <Text style={styles.statLabel}>servicios</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <CheckCircleIcon size={20} color="#10B981" />
              <Text style={styles.statNumber}>{completedCount}</Text>
              <Text style={styles.statLabel}>completados</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Historial de Servicios</Text>

        {serviceHistory.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ClipboardIcon size={48} color="#E2E8F0" />
            <Text style={styles.emptyTitle}>Sin historial</Text>
            <Text style={styles.emptyText}>
              Este equipo aún no tiene servicios registrados
            </Text>
          </View>
        ) : (
          serviceHistory.map((service, index) => {
            const statusConfig = STATUS_CONFIG[service.status] || STATUS_CONFIG.pending;
            return (
              <View key={service.id} style={styles.serviceCard}>
                <View style={styles.serviceHeader}>
                  <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                    <Text style={[styles.statusText, { color: statusConfig.text }]}>
                      {STATUS_LABELS[service.status] || service.status}
                    </Text>
                  </View>
                  <Text style={styles.orderNumber}>#{service.order_number}</Text>
                </View>

                <View style={styles.serviceInfo}>
                  {service.service_type && (
                    <View style={styles.infoRow}>
                      <WrenchIcon size={13} color="#64748b" />
                      <Text style={styles.infoLabel}>Tipo:</Text>
                      <Text style={styles.infoValue}>{service.service_type}</Text>
                    </View>
                  )}

                  <View style={styles.infoRow}>
                    <ClipboardIcon size={13} color="#64748b" />
                    <Text style={styles.infoLabel}>Descripción:</Text>
                  </View>
                  <Text style={styles.description}>{service.description}</Text>

                  {service.technician_name && (
                    <View style={styles.infoRow}>
                      <UserIcon size={13} color="#64748b" />
                      <Text style={styles.infoLabel}>Técnico:</Text>
                      <Text style={styles.infoValue}>{service.technician_name}</Text>
                    </View>
                  )}

                  <View style={styles.infoRow}>
                    <CalendarIcon size={13} color="#64748b" />
                    <Text style={styles.infoLabel}>Fecha:</Text>
                    <Text style={styles.infoValue}>
                      {new Date(service.created_at).toLocaleDateString('es-CO', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>

                  {service.completed_at && (
                    <View style={styles.infoRow}>
                      <CheckCircleIcon size={13} color="#10B981" />
                      <Text style={[styles.infoLabel, { color: '#10B981' }]}>Completado:</Text>
                      <Text style={[styles.infoValue, { color: '#10B981' }]}>
                        {new Date(service.completed_at).toLocaleDateString('es-CO', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </Text>
                    </View>
                  )}
                </View>

                {index < serviceHistory.length - 1 && <View style={styles.connector} />}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, backgroundColor: '#F8FAFC' },
  errorText: { fontSize: 16, color: '#94a3b8' },
  backBtn: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#0F4C75', borderRadius: 8 },
  backBtnText: { color: '#fff', fontWeight: '600' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0D1B2A',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerBack: { padding: 4 },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '700', flex: 1, textAlign: 'center' },
  headerAction: { padding: 6 },
  equipmentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  equipmentHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 },
  equipmentIcon: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: '#E8F4FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  equipmentName: { fontSize: 20, fontWeight: '800', color: '#0D1B2A' },
  equipmentType: { fontSize: 13, color: '#64748b', marginTop: 4 },
  clientBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F4FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  clientBadgeText: { fontSize: 13, color: '#00B4D8', fontWeight: '600' },
  specsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12 },
  specItem: { minWidth: '45%' },
  specLabel: { fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 },
  specValue: { fontSize: 14, fontWeight: '600', color: '#0D1B2A', marginTop: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  locationLabel: { fontSize: 13, color: '#64748b' },
  locationValue: { fontSize: 13, color: '#0D1B2A', fontWeight: '500' },
  notesSection: { marginBottom: 12 },
  notesLabel: { fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  notesText: { fontSize: 13, color: '#64748b', lineHeight: 18 },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 32,
  },
  statItem: { alignItems: 'center', gap: 4 },
  statNumber: { fontSize: 26, fontWeight: '800', color: '#0D1B2A' },
  statLabel: { fontSize: 12, color: '#64748b' },
  statDivider: { width: 1, height: 44, backgroundColor: '#E2E8F0' },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  serviceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: '700' },
  orderNumber: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  serviceInfo: { gap: 6 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoLabel: { fontSize: 12, color: '#64748b' },
  infoValue: { fontSize: 12, color: '#0D1B2A', fontWeight: '500' },
  description: { fontSize: 12, color: '#64748b', lineHeight: 17, marginLeft: 19, marginTop: -2 },
  connector: { position: 'absolute', left: 22, top: 66, bottom: -16, width: 2, backgroundColor: '#E2E8F0' },
  emptyContainer: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#64748b' },
  emptyText: { fontSize: 14, color: '#94a3b8', textAlign: 'center' },
});
