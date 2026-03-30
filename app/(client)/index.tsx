import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { CalendarIcon, ChevronRightIcon, ClipboardIcon, PlusIcon } from '../../components/ui/Icons';

export default function ClientHome() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?user_id=${user.id}&role=client`);
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [user?.id]);

  const firstName = user?.name?.split(' ')[0] || 'Cliente';

  return (
    <View className="flex-1 bg-surface">
      {/* Welcome header */}
      <View className="bg-ink px-5 py-5">
        <Text style={{ color: '#4A6785', fontSize: 12, fontWeight: '700', letterSpacing: 1 }}>BIENVENIDO DE NUEVO</Text>
        <View className="flex-row items-center justify-between mt-1">
          <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '800' }}>Hola, {firstName}</Text>
          <Button
            title="Nueva solicitud"
            size="sm"
            icon={<PlusIcon size={14} color="#fff" />}
            onPress={() => router.push('/(client)/new-request')}
          />
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0F4C75" />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          onRefresh={fetchOrders}
          refreshing={loading}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          ListHeaderComponent={
            orders.length > 0 ? (
              <Text style={{ color: '#64748b', fontSize: 13, fontWeight: '600', marginBottom: 4 }}>
                {orders.length} solicitud{orders.length !== 1 ? 'es' : ''} encontrada{orders.length !== 1 ? 's' : ''}
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push(`/(client)/service/${item.id}`)}
            >
              <View className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden">
                <View className="px-4 pt-4 pb-3 flex-row items-start justify-between border-b border-surface-border">
                  <View className="flex-1 mr-3">
                    <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 15 }} numberOfLines={1}>
                      {item.service_type}
                    </Text>
                    <Text style={{ color: '#94a3b8', fontSize: 11, marginTop: 1 }}>#{item.order_number || item.id?.slice(0, 8)}</Text>
                  </View>
                  <StatusBadge status={item.status} />
                </View>
                <View className="px-4 py-3 flex-row items-center justify-between">
                  <Text style={{ color: '#64748b', fontSize: 13, flex: 1, lineHeight: 18 }} numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>
                <View className="px-4 pb-3 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-1.5">
                    <CalendarIcon size={13} color="#94a3b8" />
                    <Text style={{ color: '#94a3b8', fontSize: 12 }}>
                      {new Date(item.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Text style={{ color: '#0F4C75', fontWeight: '700', fontSize: 12 }}>Ver detalle</Text>
                    <ChevronRightIcon size={14} color="#0F4C75" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className="items-center py-20 gap-4">
              <View className="w-20 h-20 rounded-2xl bg-surface-hover items-center justify-center">
                <ClipboardIcon size={32} color="#94a3b8" />
              </View>
              <View className="items-center gap-1">
                <Text style={{ color: '#0D1B2A', fontWeight: '700', fontSize: 16 }}>Sin solicitudes aún</Text>
                <Text style={{ color: '#94a3b8', fontSize: 13 }}>Crea tu primera orden de servicio</Text>
              </View>
              <Button
                title="Crear solicitud"
                variant="outline"
                size="sm"
                onPress={() => router.push('/(client)/new-request')}
              />
            </View>
          }
        />
      )}
    </View>
  );
}
