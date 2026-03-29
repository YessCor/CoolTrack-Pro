import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Card } from '../../../components/ui/Card';
import { StatusBadge, OrderStatus } from '../../../components/ui/StatusBadge';
import { Button } from '../../../components/ui/Button';

export default function JobDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [timer, setTimer] = useState('00:00:00');

  const fetchOrderDetail = async () => {
    try {
      const response = await fetch(`/api/orders/${id}`);
      const data = await response.json();
      if (data.success) {
        setOrder(data.order);
      } else {
        Alert.alert('Error', 'No se pudo cargar el detalle del trabajo.');
        router.back();
      }
    } catch (error) {
      console.error('Fetch order detail error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/orders?id=${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        setOrder(data.order);
        Alert.alert('Estado Actualizado', `Ahora el servicio está en: ${newStatus}`);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#1E40AF" className="mt-20" />;

  if (!order) {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-slate-50">
        <Text className="text-slate-500 text-center font-medium mb-4">No se pudo encontrar la información para esta orden.</Text>
        <Button title="Volver al Listado" onPress={() => router.back()} />
      </View>
    );
  }

  const status = (order?.status || 'PENDING').toUpperCase() as OrderStatus;

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <View className="flex-row items-center mb-6 mt-2">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-slate-800">Orden #{order.order_number}</Text>
          <Text className="text-slate-500">{order.service_type}</Text>
        </View>
        <StatusBadge status={status} />
      </View>

      <Card className="mb-6">
        <Text className="font-bold text-lg mb-2 text-slate-800">Cliente: {order.client_name}</Text>
        <Text className="text-slate-600 mb-3">📍 {order.address}</Text>
        <View className="h-32 bg-slate-200 rounded-xl items-center justify-center border border-slate-300 mb-3 overflow-hidden">
          <Text className="text-slate-500 font-medium">🗺️ Mapa de Ruta (Google Maps)</Text>
        </View>
        <Button title="Navegar (GPS)" variant="outline" onPress={() => Alert.alert('GPS', 'Abriendo Waze/Google Maps...')} />
      </Card>

      <Text className="text-xl font-bold text-slate-800 mb-2">Descripción</Text>
      <Card className="mb-6">
        <Text className="text-slate-700 leading-relaxed">{order.description}</Text>
      </Card>

      <Text className="text-xl font-bold text-slate-800 mb-3">Flujo de Ejecución</Text>
      <Card className="mb-6 flex-col gap-3">
        {updating ? (
          <ActivityIndicator color="#1E40AF" />
        ) : (
          <>
            {status === 'ASSIGNED' && (
              <Button title="Aceptar Trabajo" onPress={() => updateStatus('accepted')} />
            )}
            {status === 'ACCEPTED' && (
              <Button title="Reportar: Estoy en Camino" onPress={() => updateStatus('on_the_way')} />
            )}
            {status === 'ON_THE_WAY' && (
              <Button title="Reportar: Llegué al Sitio" onPress={() => updateStatus('on_site')} />
            )}
            {status === 'ON_SITE' && (
              <Button title="Iniciar Mantenimiento" onPress={() => updateStatus('in_progress')} />
            )}
            {status === 'IN_PROGRESS' && (
              <>
                <Text className="text-slate-500 mb-2 font-medium">Temporizador de Estadía: {timer}</Text>
                <TouchableOpacity className="h-24 bg-slate-50 rounded-xl items-center justify-center border border-dashed border-slate-300 mb-2">
                  <Text className="text-slate-400 font-medium">📷 Subir Evidencia Final</Text>
                </TouchableOpacity>
                <Button title="Finalizar y Cerrar Servicio" onPress={() => updateStatus('completed')} />
              </>
            )}
            {status === 'COMPLETED' && (
              <View className="bg-green-50 p-4 rounded-xl border border-green-200">
                <Text className="text-green-700 font-bold text-center">✅ Servicio Completado</Text>
                <Text className="text-green-600 text-center text-xs mt-1">El cliente ya puede ver el reporte.</Text>
              </View>
            )}
          </>
        )}
      </Card>
      <View className="h-20" />
    </ScrollView>
  );
}
