import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { ORDER_STATUS, ORDER_STATUS_LABEL, OrderStatus } from '../../lib/order-status';
import { MapPinIcon, UserIcon, ClipboardIcon, XIcon, UsersIcon } from '../../components/ui/Icons';

const ALL_FILTERS: Array<'ALL' | OrderStatus> = [
  'ALL',
  ORDER_STATUS.PENDING,
  ORDER_STATUS.ASSIGNED,
  ORDER_STATUS.ACCEPTED,
  ORDER_STATUS.IN_TRANSIT,
  ORDER_STATUS.IN_PROGRESS,
  ORDER_STATUS.COMPLETED,
  ORDER_STATUS.CANCELLED,
];

export default function AdminOrders() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [orders, setOrders] = useState<any[]>([]);
  const [techs, setTechs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [oRes, tRes] = await Promise.all([
        fetch(`/api/orders?user_id=${user?.id}&role=admin`),
        fetch('/api/admin/technicians'),
      ]);
      const [oData, tData] = await Promise.all([oRes.json(), tRes.json()]);
      if (oData.success) setOrders(oData.orders);
      if (tData.success) setTechs(tData.technicians);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAssign = async (techId: string) => {
    if (!assigningId) return;
    try {
      const res = await fetch('/api/admin/technicians', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: assigningId, technician_id: techId }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert('Asignado', 'Técnico asignado correctamente.');
        setShowModal(false);
        fetchData();
      } else {
        Alert.alert('Error', data.error || 'Fallo al asignar.');
      }
    } catch { Alert.alert('Error de red', 'No se pudo conectar.'); }
  };

  const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status?.toLowerCase() === filter);

  return (
    <View className="flex-1 bg-surface">
      {/* Filter bar */}
      <View className="bg-surface-card border-b border-surface-border px-4 py-3">
        <FlatList
          data={ALL_FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={i => i}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => {
            const active = filter === item;
            const label = item === 'ALL' ? 'Todos' : ORDER_STATUS_LABEL[item as OrderStatus] || item;
            return (
              <TouchableOpacity
                onPress={() => setFilter(item)}
                className="px-4 py-2 rounded-xl border"
                style={{ backgroundColor: active ? '#0F4C75' : '#FFFFFF', borderColor: active ? '#0F4C75' : '#E2E8F0' }}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: active ? '#fff' : '#64748b', letterSpacing: 0.3 }}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0F4C75" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          onRefresh={fetchData}
          refreshing={loading}
          renderItem={({ item }) => (
            <View className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden">
              <View className="px-4 pt-4 pb-3 flex-row items-start justify-between border-b border-surface-border">
                <View className="flex-1 mr-3">
                  <Text style={{ fontSize: 13, fontWeight: '800', color: '#0F4C75', letterSpacing: 0.5 }}>#{item.order_number}</Text>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: '#0D1B2A', marginTop: 1 }} numberOfLines={1}>{item.service_type}</Text>
                </View>
                <StatusBadge status={item.status} />
              </View>
              <View className="px-4 py-3 gap-2">
                <Text style={{ color: '#64748b', fontSize: 13, lineHeight: 18 }} numberOfLines={2}>{item.description}</Text>
                <View className="flex-row items-center gap-1.5">
                  <MapPinIcon size={13} color="#94a3b8" />
                  <Text style={{ color: '#94a3b8', fontSize: 12 }} numberOfLines={1}>{item.address}</Text>
                </View>
              </View>
              <View className="px-4 py-3 bg-surface flex-row items-center justify-between rounded-b-2xl">
                <View className="flex-row items-center gap-2">
                  <View className="w-7 h-7 rounded-full bg-brand/10 items-center justify-center" style={{ backgroundColor: '#E8F4FD' }}>
                    <UserIcon size={14} color="#0F4C75" />
                  </View>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: item.technician_name ? '#0D1B2A' : '#94a3b8' }}>
                    {item.technician_name || 'Sin asignar'}
                  </Text>
                </View>
                {item.status === ORDER_STATUS.PENDING && (
                  <Button title="Asignar" size="sm" onPress={() => { setAssigningId(item.id); setShowModal(true); }} />
                )}
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View className="items-center py-20 gap-3">
              <View className="w-16 h-16 rounded-2xl bg-surface-hover items-center justify-center">
                <ClipboardIcon size={28} color="#94a3b8" />
              </View>
              <Text style={{ color: '#94a3b8', fontWeight: '600', fontSize: 14 }}>No hay órdenes en esta categoría</Text>
            </View>
          }
        />
      )}

      {/* Assign modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(13,27,42,0.75)', justifyContent: 'flex-end' }}>
          <View className="bg-surface rounded-t-3xl" style={{ maxHeight: '70%' }}>
            <View className="px-5 pt-5 pb-4 flex-row items-center justify-between border-b border-surface-border">
              <View className="flex-row items-center gap-2">
                <UsersIcon size={20} color="#0F4C75" />
                <Text style={{ fontSize: 17, fontWeight: '700', color: '#0D1B2A' }}>Seleccionar técnico</Text>
              </View>
              <TouchableOpacity onPress={() => setShowModal(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <XIcon size={22} color="#64748b" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={techs.filter(t => t.is_active)}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={{ padding: 12, gap: 8 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleAssign(item.id)}
                  className="flex-row items-center gap-3 px-4 py-3.5 rounded-xl bg-surface-card border border-surface-border"
                >
                  <View className="w-10 h-10 rounded-full bg-brand items-center justify-center">
                    <UserIcon size={18} color="#fff" />
                  </View>
                  <View className="flex-1">
                    <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 14 }}>{item.name}</Text>
                    <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 1 }}>{item.email}</Text>
                  </View>
                  <View className="w-2 h-2 rounded-full bg-status-completed" />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
