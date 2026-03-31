import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeftIcon, AirVentIcon, ClipboardIcon, UserIcon, CalendarIcon, CheckCircleIcon, WrenchIcon } from '../../../../components/ui/Icons';
import { useAuth } from '../../../../context/AuthContext';

const EQUIPMENT_TYPE_LABELS: Record<string, string> = {
  split: 'Aire de ventana',
  central: 'Sistema Central',
  mini_split: 'Minisplit',
  chiller: 'Chiller',
  fan_coil: 'Fan Coil',
  other: 'Otro',
};

const STATUS_CONFIG: Record<string, { bg: string; text: string; icon: string }> = {
  pending: { bg: '#FEF3C7', text: '#D97706', icon: '⏳' },
  assigned: { bg: '#DBEAFE', text: '#2563EB', icon: '👤' },
  accepted: { bg: '#DBEAFE', text: '#2563EB', icon: '✓' },
  in_transit: { bg: '#E0E7FF', text: '#4F46E5', icon: '🚗' },
  in_progress: { bg: '#D1FAE5', text: '#059669', icon: '🔧' },
  completed: { bg: '#ECFDF5', text: '#10B981', icon: '✅' },
  cancelled: { bg: '#FEE2E2', text: '#DC2626', icon: '❌' },
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

export default function EquipmentHistoryScreen() {
  const { id, client_id } = useLocalSearchParams<{ id: string; client_id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  
  const [equipment, setEquipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    if (!user?.id || !client_id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/equipment?user_id=${user.id}&role=admin&client_id=${client_id}`);
      const data = await res.json();
      if (data.success) {
        const found = data.equipment?.find((e: any) => e.id === id);
        setEquipment(found || null);
      } else {
        console.error('[loadData] API error:', data.error);
        setEquipment(null);
      }
    } catch (e) { console.error('[loadData] Fetch error:', e); }
    finally { setLoading(false); }
  };

  const renderService = ({ item, index }: { item: any; index: number }) => {
    const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
    
    return (
      <View style={styles.serviceCard}>
        <View style={styles.serviceHeader}>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
            <Text style={[styles.statusText, { color: statusConfig.text }]}>
              {STATUS_LABELS[item.status] || item.status}
            </Text>
          </View>
          <Text style={styles.orderNumber}>#{item.order_number}</Text>
        </View>

        <View style={styles.serviceInfo}>
          {item.service_type && (
            <View style={styles.infoRow}>
              <WrenchIcon size={14} color="#64748b" />
              <Text style={styles.infoLabel}>Tipo:</Text>
              <Text style={styles.infoValue}>{item.service_type}</Text>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <ClipboardIcon size={14} color="#64748b" />
            <Text style={styles.infoLabel}>Descripción:</Text>
          </View>
          <Text style={styles.description}>{item.description}</Text>
          
          {item.technician_name && (
            <View style={styles.infoRow}>
              <UserIcon size={14} color="#64748b" />
              <Text style={styles.infoLabel}>Técnico:</Text>
              <Text style={styles.infoValue}>{item.technician_name}</Text>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <CalendarIcon size={14} color="#64748b" />
            <Text style={styles.infoLabel}>Fecha:</Text>
            <Text style={styles.infoValue}>
              {new Date(item.created_at).toLocaleDateString('es-CO', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </View>

          {item.completed_at && (
            <View style={styles.infoRow}>
              <CheckCircleIcon size={14} color="#10B981" />
              <Text style={[styles.infoLabel, { color: '#10B981' }]}>Completado:</Text>
              <Text style={[styles.infoValue, { color: '#10B981' }]}>
                {new Date(item.completed_at).toLocaleDateString('es-CO', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>
          )}
        </View>

        {index < (equipment?.service_history?.length || 0) - 1 && (
          <View style={styles.connector} />
        )}
      </View>
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
      </View>
    );
  }

  const serviceHistory = equipment.service_history || [];
  const completedCount = serviceHistory.filter((s: any) => s.status === 'completed').length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeftIcon size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial del Equipo</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={serviceHistory}
        keyExtractor={item => item.id}
        renderItem={renderService}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <View style={styles.equipmentInfo}>
            <View style={styles.equipmentCard}>
              <View style={styles.equipmentHeader}>
                <View style={styles.equipmentIcon}>
                  <AirVentIcon size={28} color="#0F4C75" />
                </View>
                <View style={styles.equipmentDetails}>
                  <Text style={styles.equipmentName}>
                    {equipment.name || EQUIPMENT_TYPE_LABELS[equipment.type] || 'Equipo'}
                  </Text>
                  <Text style={styles.equipmentType}>
                    {EQUIPMENT_TYPE_LABELS[equipment.type] || equipment.type}
                  </Text>
                </View>
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
                  <Text style={styles.locationLabel}>Ubicación:</Text>
                  <Text style={styles.locationValue}>{equipment.location_description}</Text>
                </View>
              )}

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <ClipboardIcon size={18} color="#0F4C75" />
                  <Text style={styles.statNumber}>{serviceHistory.length}</Text>
                  <Text style={styles.statLabel}>servicios</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <CheckCircleIcon size={18} color="#10B981" />
                  <Text style={styles.statNumber}>{completedCount}</Text>
                  <Text style={styles.statLabel}>completados</Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Historial de Servicios</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <ClipboardIcon size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>Sin historial</Text>
            <Text style={styles.emptyText}>
              Este equipo aún no tiene servicios registrados
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#0D1B2A', paddingHorizontal: 16, paddingVertical: 14,
  },
  backButton: { padding: 4 },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#94a3b8', fontSize: 16 },
  equipmentInfo: { marginBottom: 16 },
  equipmentCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 20,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  equipmentHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  equipmentIcon: {
    width: 60, height: 60, borderRadius: 14, backgroundColor: '#E8F4FD',
    justifyContent: 'center', alignItems: 'center',
  },
  equipmentDetails: { flex: 1 },
  equipmentName: { fontSize: 20, fontWeight: '800', color: '#0D1B2A' },
  equipmentType: { fontSize: 14, color: '#64748b', marginTop: 4 },
  specsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12 },
  specItem: { minWidth: '45%' },
  specLabel: { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 },
  specValue: { fontSize: 14, fontWeight: '600', color: '#0D1B2A', marginTop: 2 },
  locationRow: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  locationLabel: { fontSize: 13, color: '#64748b' },
  locationValue: { fontSize: 13, color: '#0D1B2A', fontWeight: '500' },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', gap: 24 },
  statItem: { alignItems: 'center', gap: 4 },
  statNumber: { fontSize: 24, fontWeight: '800', color: '#0D1B2A' },
  statLabel: { fontSize: 12, color: '#64748b' },
  statDivider: { width: 1, height: 40, backgroundColor: '#E2E8F0' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 },
  serviceCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  serviceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 12, fontWeight: '700' },
  orderNumber: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  serviceInfo: { gap: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoLabel: { fontSize: 13, color: '#64748b' },
  infoValue: { fontSize: 13, color: '#0D1B2A', fontWeight: '500' },
  description: { fontSize: 13, color: '#64748b', lineHeight: 18, marginTop: -4, marginLeft: 22 },
  connector: { position: 'absolute', left: 24, top: 70, bottom: -20, width: 2, backgroundColor: '#E2E8F0' },
  empty: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#64748b' },
  emptyText: { fontSize: 14, color: '#94a3b8', textAlign: 'center' },
});
