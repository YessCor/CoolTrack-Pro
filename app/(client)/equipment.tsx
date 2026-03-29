import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';

export default function EquipmentScreen() {
  const { user } = useAuth();
  const [equipments, setEquipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEquipments = async () => {
    if (!user?.id || user.id === 'mock') {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`/api/equipment?client_id=${user.id}`);
      const data = await response.json();
      if (data.success) {
        setEquipments(data.equipments);
      }
    } catch (error) {
      console.error('Fetch equipment error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, [user?.id]);

  if (loading) return <ActivityIndicator size="large" color="#1E40AF" className="mt-10" />;

  return (
    <View className="flex-1 bg-slate-50 p-4">
      <FlatList
        data={equipments}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchEquipments} colors={["#1E40AF"]} />
        }
        renderItem={({ item }) => (
          <Card className="mb-4">
            <Text className="text-lg font-bold text-slate-800 mb-1">{item.type} - {item.brand}</Text>
            <Text className="text-slate-600 mb-2">📍 {item.location}</Text>
            <View className="bg-slate-100 p-3 rounded-xl border border-slate-200">
              <Text className="text-[10px] text-slate-400 font-bold uppercase mb-1">Modelo / Serial</Text>
              <Text className="text-sm text-slate-800">{item.model || 'N/A'} - {item.serial_number || 'N/A'}</Text>
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <View className="items-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 mt-4 px-6">
            <Text className="text-slate-400 text-center font-medium italic">
              Aún no tienes equipos registrados. Cuando un técnico realice un servicio, tus equipos aparecerán aquí.
            </Text>
          </View>
        }
      />
    </View>
  );
}
