import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';

export default function ClientHome() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/orders?user_id=${user.id}&role=client`);
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Fetch client orders error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user?.id]);

  return (
    <View className="flex-1 bg-slate-50 p-4">
      <View className="flex-row justify-between items-center mb-6 mt-2">
        <View>
          <Text className="text-2xl font-bold text-slate-800">Hola, {user?.name?.split(' ')[0]}</Text>
          <Text className="text-slate-500">Tus solicitudes de servicio</Text>
        </View>
        <Button 
          title="+ Nuevo" 
          onPress={() => router.push('/(client)/new-request')} 
          className="px-4 py-2"
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1E40AF" className="mt-10" />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          onRefresh={fetchOrders}
          refreshing={loading}
          renderItem={({ item }) => (
            <TouchableOpacity 
              className="mb-4" 
              onPress={() => router.push(`/(client)/service/${item.id}`)}
            >
              <Card>
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="text-lg font-bold text-slate-800 flex-1 mr-2">{item.service_type}</Text>
                  <StatusBadge status={item.status} />
                </View>
                <Text className="text-slate-500 mb-2" numberOfLines={2}>{item.description}</Text>
                <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-slate-50">
                  <Text className="text-slate-400 text-xs">📅 {new Date(item.created_at).toLocaleDateString()}</Text>
                  <Text className="text-primary font-medium text-xs">Ver detalle →</Text>
                </View>
              </Card>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className="bg-white p-10 rounded-3xl border border-dashed border-slate-200 items-center mt-4">
              <Text className="text-slate-400 text-center font-medium">No tienes órdenes activas.</Text>
              <Button 
                title="Crear mi primera orden" 
                variant="outline" 
                className="mt-4" 
                onPress={() => router.push('/(client)/new-request')}
              />
            </View>
          }
        />
      )}
    </View>
  );
}
