import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Modal } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { ORDER_STATUS, ORDER_STATUS_LABEL, OrderStatus } from '../../lib/order-status';

export default function AdminOrders() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [orders, setOrders] = useState<any[]>([]);
  const [techs, setTechs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [showTechModal, setShowTechModal] = useState(false);

  // Filtros usando estados reales de la DB
  const filters: Array<'ALL' | OrderStatus> = [
    'ALL',
    ORDER_STATUS.PENDING,
    ORDER_STATUS.ASSIGNED,
    ORDER_STATUS.ACCEPTED,
    ORDER_STATUS.IN_TRANSIT,
    ORDER_STATUS.IN_PROGRESS,
    ORDER_STATUS.COMPLETED,
    ORDER_STATUS.CANCELLED,
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordRes, techRes] = await Promise.all([
        fetch(`/api/orders?user_id=${user?.id}&role=admin`),
        fetch('/api/admin/technicians')
      ]);

      const [ordData, techData] = await Promise.all([
        ordRes.json(),
        techRes.json()
      ]);

      if (ordData.success) setOrders(ordData.orders);
      if (techData.success) setTechs(techData.technicians);
    } catch (error) {
      console.error('Fetch admin data error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

    const handleAssign = async (techId: string) => {
      if (!assigningId) return;
      try {
        const response = await fetch('/api/admin/technicians', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: assigningId,
            technician_id: techId
          }),
        });
        const data = await response.json();
        
        if (data.success) {
          Alert.alert('Éxito', 'Técnico asignado correctamente.');
          setShowTechModal(false);
          fetchData();
        } else {
          Alert.alert('Error de Asignación', data.error || data.debug || 'Fallo inesperado del servidor.');
        }
      } catch (error: any) {
        console.error('Frontend assign error:', error);
        Alert.alert('Fallo de Conexión', 'No se pudo contactar con el servidor de la API.');
      }
    };

  const filteredOrders = orders.filter(o =>
    filter === 'ALL' || o.status === filter
  );

  return (
    <View className="flex-1 bg-slate-50">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-slate-800 mb-4">Monitor de Operaciones</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
          {filters.map(f => (
            <TouchableOpacity 
              key={f}
              onPress={() => setFilter(f)}
              className={`px-4 py-2 rounded-full mr-2 border ${filter === f ? 'bg-primary border-primary' : 'bg-white border-slate-200'}`}
            >
              <Text className={filter === f ? 'text-white font-bold' : 'text-slate-600 font-medium'}>
                {f === 'ALL' ? 'Todos' : ORDER_STATUS_LABEL[f as OrderStatus]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1E40AF" className="mt-10" />
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          onRefresh={fetchData}
          refreshing={loading}
          renderItem={({ item }) => (
            <Card className="mb-4">
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 mr-2">
                  <Text className="text-lg font-bold text-slate-800">#{item.order_number}</Text>
                  <Text className="text-slate-400 text-xs">{item.service_type}</Text>
                </View>
                <StatusBadge status={item.status} />
              </View>
              
              <Text className="text-slate-600 mb-2 font-medium" numberOfLines={2}>{item.description}</Text>
              <Text className="text-slate-500 text-sm mb-3">📍 {item.address}</Text>

              <View className="flex-row justify-between items-center pt-3 border-t border-slate-50">
                <View>
                  <Text className="text-slate-400 text-[10px] uppercase font-bold">Asignado a:</Text>
                  <Text className="text-slate-700 font-semibold">{item.technician_name || '❌ Sin asignar'}</Text>
                </View>
                {item.status === 'pending' && (
                  <Button 
                    title="Asignar" 
                    onPress={() => { setAssigningId(item.id); setShowTechModal(true); }}
                    className="px-4 py-1.5"
                  />
                )}
              </View>
            </Card>
          )}
          ListEmptyComponent={
            <View className="items-center py-20">
              <Text className="text-slate-400">No se encontraron órdenes.</Text>
            </View>
          }
        />
      )}

      {/* Modal de Selección de Técnico */}
      <Modal visible={showTechModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 h-[70%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-slate-800">Asignar Personal</Text>
              <TouchableOpacity onPress={() => setShowTechModal(false)}>
                <Text className="text-primary font-bold">Cerrar</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={techs.filter(t => t.is_active)}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => handleAssign(item.id)}
                  className="p-4 border-b border-slate-100 flex-row items-center"
                >
                  <View className="w-10 h-10 bg-slate-200 rounded-full items-center justify-center mr-4">
                    <Text>👨‍🔧</Text>
                  </View>
                  <View>
                    <Text className="font-bold text-slate-800">{item.name}</Text>
                    <Text className="text-slate-400 text-xs">{item.email}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
