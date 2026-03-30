import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { MapPinIcon, LayersIcon, AirVentIcon } from '../../components/ui/Icons';

export default function EquipmentScreen() {
  const { user } = useAuth();
  const [equipments, setEquipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEquipments = async () => {
    if (!user?.id || user.id === 'mock') { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/equipment?client_id=${user.id}`);
      const data = await res.json();
      if (data.success) setEquipments(data.equipments);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEquipments(); }, [user?.id]);

  if (loading) return (
    <View className="flex-1 bg-surface items-center justify-center">
      <ActivityIndicator size="large" color="#0F4C75" />
    </View>
  );

  return (
    <View className="flex-1 bg-surface">
      <FlatList
        data={equipments}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchEquipments} colors={['#0F4C75']} tintColor="#0F4C75" />}
        renderItem={({ item }) => (
          <View className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden">
            <View className="px-4 pt-4 pb-3 flex-row items-start gap-3 border-b border-surface-border">
              <View className="w-10 h-10 rounded-xl bg-brand/10 items-center justify-center" style={{ backgroundColor: '#E8F4FD' }}>
                <AirVentIcon size={20} color="#0F4C75" />
              </View>
              <View className="flex-1">
                <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 15 }}>
                  {item.type} — {item.brand}
                </Text>
                <View className="flex-row items-center gap-1.5 mt-1">
                  <MapPinIcon size={12} color="#94a3b8" />
                  <Text style={{ color: '#64748b', fontSize: 12 }}>{item.location}</Text>
                </View>
              </View>
            </View>
            <View className="px-4 py-3 flex-row items-center gap-3">
              <LayersIcon size={14} color="#94a3b8" />
              <Text style={{ color: '#64748b', fontSize: 13 }}>
                {item.model || 'N/A'} · Serie: {item.serial_number || 'N/A'}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center py-20 gap-4">
            <View className="w-20 h-20 rounded-2xl bg-surface-hover items-center justify-center">
              <AirVentIcon size={32} color="#94a3b8" />
            </View>
            <View className="items-center gap-1 px-8">
              <Text style={{ color: '#0D1B2A', fontWeight: '700', fontSize: 16 }}>Sin equipos registrados</Text>
              <Text style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', lineHeight: 18 }}>
                Tus equipos aparecerán aquí después del primer servicio técnico.
              </Text>
            </View>
          </View>
        }
      />
    </View>
  );
}
