import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeftIcon, AirVentIcon, ChevronRightIcon, MapPinIcon, PhoneIcon, MailIcon, ClipboardIcon, WrenchIcon } from '../../../components/ui/Icons';
import { useAuth } from '../../../context/AuthContext';

const EQUIPMENT_TYPE_LABELS: Record<string, string> = {
  split: 'Aire de ventana',
  central: 'Sistema Central',
  mini_split: 'Minisplit',
  chiller: 'Chiller',
  fan_coil: 'Fan Coil',
  other: 'Otro',
};

export default function ClientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  
  const [client, setClient] = useState<any>(null);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [clientRes, equipRes] = await Promise.all([
        fetch(`/api/admin/clients?user_id=${user.id}&role=admin`),
        fetch(`/api/admin/equipment?user_id=${user.id}&role=admin&client_id=${id}`),
      ]);
      
      const [clientData, equipData] = await Promise.all([clientRes.json(), equipRes.json()]);
      
      if (clientData.success) {
        const found = clientData.clients?.find((c: any) => c.id === id);
        setClient(found);
      }
      
      if (equipData.success) {
        setEquipment(equipData.equipment || []);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const renderEquipment = ({ item }: { item: any }) => {
    const serviceHistory = item.service_history || [];
    const completedServices = serviceHistory.filter((s: any) => s.status === 'completed');
    const lastService = serviceHistory[0];
    
    return (
      <TouchableOpacity
        style={styles.equipmentCard}
        onPress={() => router.push({ pathname: '/(admin)/client/equipment/[id]', params: { id: item.id, client_id: id } } as any)}
      >
        <View style={styles.equipmentRow}>
          <View style={styles.equipmentIcon}>
            <AirVentIcon size={22} color="#0F4C75" />
          </View>
          <View style={styles.equipmentInfo}>
            <Text style={styles.equipmentName}>
              {item.name || EQUIPMENT_TYPE_LABELS[item.type] || 'Equipo'}
            </Text>
            <Text style={styles.equipmentType}>{EQUIPMENT_TYPE_LABELS[item.type] || item.type}</Text>
            {item.location_description && (
              <View style={styles.locationRow}>
                <MapPinIcon size={11} color="#94a3b8" />
                <Text style={styles.locationText}>{item.location_description}</Text>
              </View>
            )}
          </View>
          <ChevronRightIcon size={20} color="#CBD5E1" />
        </View>
        
        <View style={styles.serviceStats}>
          <View style={styles.serviceStat}>
            <ClipboardIcon size={13} color="#0F4C75" />
            <Text style={styles.serviceStatText}>{completedServices.length} servicios</Text>
          </View>
          {lastService && (
            <Text style={styles.lastService}>
              Último: {new Date(lastService.created_at).toLocaleDateString('es-CO')}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0F4C75" />
      </View>
    );
  }

  if (!client) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Cliente no encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeftIcon size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Cliente</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={equipment}
        keyExtractor={item => item.id}
        renderItem={renderEquipment}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListHeaderComponent={
          <>
            <View style={styles.clientCard}>
              <View style={styles.clientHeader}>
                <View style={styles.clientAvatar}>
                  <Text style={styles.clientAvatarText}>
                    {client.name?.charAt(0)?.toUpperCase() || 'C'}
                  </Text>
                </View>
                <View style={styles.clientInfoContainer}>
                  <Text style={styles.clientName}>{client.name}</Text>
                  <View style={styles.emailRow}>
                    <MailIcon size={12} color="#64748b" />
                    <Text style={styles.clientEmail}>{client.email}</Text>
                  </View>
                </View>
              </View>
              
              {client.phone && (
                <View style={styles.clientRow}>
                  <PhoneIcon size={14} color="#64748b" />
                  <Text style={styles.clientInfo}>{client.phone}</Text>
                </View>
              )}
              
              {client.address && (
                <View style={styles.clientRow}>
                  <MapPinIcon size={14} color="#64748b" />
                  <Text style={styles.clientInfo}>{client.address}</Text>
                </View>
              )}
              
              <View style={styles.clientStats}>
                <View style={styles.clientStat}>
                  <AirVentIcon size={16} color="#0F4C75" />
                  <Text style={styles.clientStatText}>{equipment.length} equipos</Text>
                </View>
                <View style={styles.clientStat}>
                  <WrenchIcon size={16} color="#0F4C75" />
                  <Text style={styles.clientStatText}>
                    {equipment.reduce((acc, e) => acc + (e.service_history?.length || 0), 0)} servicios
                  </Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>Equipos del Cliente</Text>
          </>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <AirVentIcon size={40} color="#CBD5E1" />
            <Text style={styles.emptyText}>Este cliente no tiene equipos registrados</Text>
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
  clientCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  clientHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  clientAvatar: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#0F4C75',
    justifyContent: 'center', alignItems: 'center',
  },
  clientAvatarText: { color: '#fff', fontSize: 22, fontWeight: '800' },
  clientInfoContainer: { flex: 1 },
  clientName: { fontSize: 18, fontWeight: '700', color: '#0D1B2A' },
  emailRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  clientEmail: { fontSize: 13, color: '#64748b' },
  clientRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  clientInfo: { fontSize: 14, color: '#64748b' },
  clientStats: { flexDirection: 'row', gap: 20, marginTop: 8, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  clientStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  clientStatText: { fontSize: 13, fontWeight: '600', color: '#0D1B2A' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  equipmentCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E2E8F0',
  },
  equipmentRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  equipmentIcon: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#E8F4FD', justifyContent: 'center', alignItems: 'center' },
  equipmentInfo: { flex: 1 },
  equipmentName: { fontSize: 16, fontWeight: '700', color: '#0D1B2A' },
  equipmentType: { fontSize: 12, color: '#64748b', marginTop: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  locationText: { fontSize: 12, color: '#94a3b8' },
  serviceStats: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  serviceStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  serviceStatText: { fontSize: 12, fontWeight: '600', color: '#0F4C75' },
  lastService: { fontSize: 11, color: '#94a3b8' },
  empty: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emptyText: { color: '#94a3b8', fontSize: 14 },
});
