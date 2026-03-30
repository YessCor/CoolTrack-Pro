import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { MapPinIcon, LayersIcon, AirVentIcon, PlusIcon, EditIcon, TrashIcon } from '../../components/ui/Icons';

const EQUIPMENT_TYPES: Record<string, string> = {
  split: 'Aire de ventana',
  central: 'Sistema Central',
  mini_split: 'Minisplit',
  chiller: 'Chiller',
  fan_coil: 'Fan Coil',
  other: 'Otro',
};

export default function EquipmentScreen() {
  const { user } = useAuth();
  const router = useRouter();
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

  const handleDelete = (equipment: any) => {
    Alert.alert(
      'Eliminar Equipo',
      `¿Estás seguro de eliminar "${equipment.name || equipment.type}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`/api/equipment/${equipment.id}`, { method: 'DELETE' });
              const data = await res.json();
              if (data.success) {
                setEquipments(prev => prev.filter(e => e.id !== equipment.id));
                Alert.alert('Eliminado', 'El equipo ha sido eliminado.');
              } else {
                Alert.alert('Error', data.error || 'No se pudo eliminar.');
              }
            } catch { Alert.alert('Error', 'Fallo de conexión.'); }
          },
        },
      ]
    );
  };

  const handleEdit = (equipment: any) => {
    router.push({
      pathname: '/(client)/new-equipment',
      params: { 
        id: equipment.id,
        mode: 'edit',
        name: equipment.name || '',
        type: equipment.type || '',
        brand: equipment.brand || '',
        model: equipment.model || '',
        serial_number: equipment.serial_number || '',
        capacity_tons: equipment.capacity_tons?.toString() || '',
        location_description: equipment.location_description || '',
        notes: equipment.notes || '',
      },
    });
  };

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
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 80 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchEquipments} colors={['#0F4C75']} tintColor="#0F4C75" />}
        renderItem={({ item }) => (
          <View className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden">
            <View className="px-4 pt-4 pb-3 flex-row items-start gap-3 border-b border-surface-border">
              <View className="w-10 h-10 rounded-xl bg-brand/10 items-center justify-center" style={{ backgroundColor: '#E8F4FD' }}>
                <AirVentIcon size={20} color="#0F4C75" />
              </View>
              <View className="flex-1">
                <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 15 }}>
                  {item.name || EQUIPMENT_TYPES[item.type] || item.type}
                </Text>
                <Text style={{ color: '#0F4C75', fontSize: 12, marginTop: 2 }}>
                  {EQUIPMENT_TYPES[item.type] || item.type}
                </Text>
                <View className="flex-row items-center gap-1.5 mt-1">
                  <MapPinIcon size={12} color="#94a3b8" />
                  <Text style={{ color: '#64748b', fontSize: 12 }}>{item.location_description}</Text>
                </View>
              </View>
            </View>
            <View className="px-4 py-3 flex-row items-center justify-between gap-3">
              <View className="flex-row items-center gap-3">
                <LayersIcon size={14} color="#94a3b8" />
                <Text style={{ color: '#64748b', fontSize: 13 }}>
                  {item.brand || 'N/A'} {item.model ? `· ${item.model}` : ''}
                </Text>
              </View>
              {item.serial_number && (
                <Text style={{ color: '#94a3b8', fontSize: 11 }}>Serie: {item.serial_number}</Text>
              )}
            </View>
            <View className="px-4 pb-3 flex-row justify-end gap-2">
              <TouchableOpacity
                onPress={() => handleEdit(item)}
                className="flex-row items-center gap-1.5 px-3 py-2 rounded-lg"
                style={{ backgroundColor: '#E8F4FD' }}
              >
                <EditIcon size={14} color="#0F4C75" />
                <Text style={{ color: '#0F4C75', fontSize: 12, fontWeight: '600' }}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item)}
                className="flex-row items-center gap-1.5 px-3 py-2 rounded-lg"
                style={{ backgroundColor: '#FEF2F2' }}
              >
                <TrashIcon size={14} color="#EF4444" />
                <Text style={{ color: '#EF4444', fontSize: 12, fontWeight: '600' }}>Eliminar</Text>
              </TouchableOpacity>
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
                Agrega tus equipos para solicitarservicios más rápido.
              </Text>
            </View>
          </View>
        }
      />
      
      <TouchableOpacity
        onPress={() => router.push('/(client)/new-equipment')}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        style={{ backgroundColor: '#0F4C75' }}
      >
        <PlusIcon size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
