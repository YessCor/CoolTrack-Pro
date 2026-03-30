import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { MapPinIcon, UserIcon, ChevronRightIcon, ClipboardIcon } from '../../components/ui/Icons';

export default function TechnicianHome() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?user_id=${user.id}&role=technician`);
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, [user?.id]);

  const pending = orders.filter(o => !['COMPLETED', 'CANCELLED', 'INVOICED'].includes(o.status?.toUpperCase()));
  const done = orders.filter(o => ['COMPLETED', 'INVOICED'].includes(o.status?.toUpperCase()));

  return (
    <View className="flex-1 bg-surface">
      {/* Map placeholder */}
      <View style={{ height: 160, backgroundColor: '#EEF2F7', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
        <View className="flex-1 items-center justify-center gap-2">
          <View className="w-12 h-12 rounded-xl bg-brand/10 items-center justify-center" style={{ backgroundColor: '#E8F4FD' }}>
            <MapPinIcon size={22} color="#0F4C75" />
          </View>
          <Text style={{ color: '#64748b', fontWeight: '600', fontSize: 13 }}>Mapa de servicios activos</Text>
          <Text style={{ color: '#94a3b8', fontSize: 11 }}>Disponible con Google Maps API</Text>
        </View>
      </View>

      {loading && orders.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0F4C75" />
        </View>
      ) : (
        <FlatList
          data={[...pending, ...done]}
          keyExtractor={item => item.id}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchJobs} colors={['#0F4C75']} tintColor="#0F4C75" />}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          ListHeaderComponent={
            pending.length > 0 ? (
              <Text style={{ color: '#64748b', fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
                {pending.length} trabajo{pending.length !== 1 ? 's' : ''} activo{pending.length !== 1 ? 's' : ''}
              </Text>
            ) : null
          }
          renderItem={({ item }) => {
            const isActive = !['COMPLETED', 'CANCELLED', 'INVOICED'].includes(item.status?.toUpperCase());
            return (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push(`/(technician)/job/${item.id}`)}
              >
                <View
                  className="bg-surface-card rounded-2xl border overflow-hidden"
                  style={{ borderColor: isActive ? '#0F4C75' + '30' : '#E2E8F0', borderLeftWidth: isActive ? 3 : 1, borderLeftColor: isActive ? '#0F4C75' : '#E2E8F0' }}
                >
                  <View className="px-4 pt-4 pb-3 flex-row items-start justify-between border-b border-surface-border">
                    <View className="flex-1 mr-3">
                      <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 15 }}>{item.service_type}</Text>
                      <Text style={{ color: '#94a3b8', fontSize: 11, marginTop: 1 }}>#{item.order_number}</Text>
                    </View>
                    <StatusBadge status={item.status} />
                  </View>
                  <View className="px-4 py-3 gap-2">
                    <View className="flex-row items-center gap-2">
                      <MapPinIcon size={14} color="#94a3b8" />
                      <Text style={{ color: '#64748b', fontSize: 13, flex: 1 }} numberOfLines={1}>{item.address}</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <UserIcon size={14} color="#94a3b8" />
                      <Text style={{ color: '#64748b', fontSize: 13 }}>{item.client_name}</Text>
                    </View>
                  </View>
                  {isActive && (
                    <View className="px-4 pb-3 flex-row items-center justify-end gap-1">
                      <Text style={{ color: '#0F4C75', fontWeight: '700', fontSize: 12, letterSpacing: 0.5 }}>INICIAR RUTA</Text>
                      <ChevronRightIcon size={14} color="#0F4C75" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View className="items-center py-20 gap-4">
              <View className="w-20 h-20 rounded-2xl bg-surface-hover items-center justify-center">
                <ClipboardIcon size={32} color="#94a3b8" />
              </View>
              <View className="items-center gap-1">
                <Text style={{ color: '#0D1B2A', fontWeight: '700', fontSize: 16 }}>Sin trabajos asignados</Text>
                <Text style={{ color: '#94a3b8', fontSize: 13 }}>Desliza hacia abajo para actualizar</Text>
              </View>
            </View>
          }
        />
      )}
    </View>
  );
}
