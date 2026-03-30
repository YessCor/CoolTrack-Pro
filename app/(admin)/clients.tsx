import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { UserIcon, ClipboardIcon, AirVentIcon, ChevronRightIcon, PhoneIcon } from '../../components/ui/Icons';

const EQUIPMENT_TYPES: Record<string, string> = {
  split: 'Ventana',
  central: 'Central',
  mini_split: 'Minisplit',
  chiller: 'Chiller',
  fan_coil: 'Fan Coil',
  other: 'Otro',
};

export default function AdminClients() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/clients');
      const data = await res.json();
      if (data.success) setClients(data.clients);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchClients(); }, []);

  if (loading) return (
    <View className="flex-1 bg-surface items-center justify-center">
      <ActivityIndicator size="large" color="#0F4C75" />
    </View>
  );

  return (
    <View className="flex-1 bg-surface">
      <View className="bg-surface-card border-b border-surface-border px-4 py-3">
        <Text style={{ color: '#64748b', fontSize: 13, fontWeight: '600' }}>
          {clients.length} cliente{clients.length !== 1 ? 's' : ''} registrado{clients.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={clients}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchClients} colors={['#0F4C75']} tintColor="#0F4C75" />}
        renderItem={({ item }) => (
          <View
            className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden"
          >
            <View className="px-4 py-4 flex-row items-center gap-3 border-b border-surface-border">
              <View className="w-11 h-11 rounded-full bg-brand/10 items-center justify-center">
                <UserIcon size={20} color="#0F4C75" />
              </View>
              <View className="flex-1">
                <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 15 }}>{item.name}</Text>
                <View className="flex-row items-center gap-1 mt-1">
                  <PhoneIcon size={12} color="#94a3b8" />
                  <Text style={{ color: '#94a3b8', fontSize: 12 }}>{item.phone || 'Sin teléfono'}</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-1.5 bg-brand/8 px-3 py-1.5 rounded-xl" style={{ backgroundColor: '#E8F4FD' }}>
                <ClipboardIcon size={13} color="#0F4C75" />
                <Text style={{ color: '#0F4C75', fontWeight: '700', fontSize: 12 }}>
                  {item.pending_orders || 0}
                </Text>
              </View>
              <ChevronRightIcon size={18} color="#94a3b8" />
            </View>
            
            {item.equipment_count > 0 ? (
              <View className="px-4 py-3 flex-row items-center gap-4">
                <View className="flex-row items-center gap-2">
                  <AirVentIcon size={14} color="#94a3b8" />
                  <Text style={{ color: '#64748b', fontSize: 12, fontWeight: '600' }}>
                    {item.equipment_count} equipo{item.equipment_count !== 1 ? 's' : ''}
                  </Text>
                </View>
                <View className="flex-row flex-wrap gap-1">
                  {item.equipment_types?.slice(0, 3).map((type: string, idx: number) => (
                    <View key={idx} className="px-2 py-0.5 rounded bg-surface-hover">
                      <Text style={{ color: '#64748b', fontSize: 10 }}>{EQUIPMENT_TYPES[type] || type}</Text>
                    </View>
                  ))}
                  {item.equipment_count > 3 && (
                    <View className="px-2 py-0.5 rounded bg-surface-hover">
                      <Text style={{ color: '#64748b', fontSize: 10 }}>+{item.equipment_count - 3}</Text>
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <View className="px-4 py-3">
                <Text style={{ color: '#94a3b8', fontSize: 12 }}>Sin equipos registrados</Text>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center py-20 gap-4">
            <View className="w-20 h-20 rounded-2xl bg-surface-hover items-center justify-center">
              <UserIcon size={32} color="#94a3b8" />
            </View>
            <Text style={{ color: '#0D1B2A', fontWeight: '700', fontSize: 16 }}>Sin clientes registrados</Text>
          </View>
        }
      />
    </View>
  );
}
