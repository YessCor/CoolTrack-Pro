import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';

export default function TechnicianHome() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/orders?user_id=${user.id}&role=technician`);
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Fetch technician jobs error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user?.id]);

  return (
    <View className="flex-1 bg-slate-50 p-4">
      <View className="h-40 bg-slate-200 rounded-2xl items-center justify-center mb-6 mt-2 shadow-sm border border-slate-300">
        <Text className="text-slate-500 font-bold">🗺️ Mapa de Servicios Activos</Text>
        <Text className="text-slate-400 text-xs mt-1">Implementación de Mapas en Fase 6</Text>
      </View>

      <Text className="text-xl font-bold text-slate-800 mb-4">Agenda de Trabajo</Text>

      {loading && orders.length === 0 ? (
        <ActivityIndicator size="large" color="#1E40AF" className="mt-10" />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchJobs} colors={["#1E40AF"]} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/(technician)/job/${item.id}`)} className="mb-4">
              <Card>
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1 mr-2">
                    <Text className="text-lg font-bold text-slate-800">{item.service_type}</Text>
                    <Text className="text-slate-400 text-xs">#{item.order_number}</Text>
                  </View>
                  <StatusBadge status={item.status} />
                </View>
                <Text className="text-slate-600 mb-1 font-medium">📍 {item.address}</Text>
                <Text className="text-slate-400 text-sm mt-1" numberOfLines={1}>Cliente: {item.client_name}</Text>
                <View className="flex-row justify-end mt-2">
                  <Text className="text-primary font-bold text-xs">INICIAR RUTA →</Text>
                </View>
              </Card>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className="items-center py-20">
              <Text className="text-slate-400 font-medium">No tienes trabajos asignados para hoy.</Text>
              <Text className="text-slate-300 text-xs mt-2">Actualiza deslizando hacia abajo.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
