import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Card } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { ORDER_STATUS, TECHNICIAN_NEXT_STATUS, ORDER_STATUS_LABEL, OrderStatus } from '../../../lib/order-status';

// Botones y mensajes para cada paso del técnico
const STEP_CONFIG: Partial<Record<OrderStatus, { label: string; description: string }>> = {
  assigned:    { label: '✅ Aceptar Trabajo',          description: 'Confirma que tomaste este servicio.' },
  accepted:    { label: '🚗 Estoy en Camino',           description: 'Informa que vas hacia el cliente.' },
  in_transit:  { label: '📍 Llegué al Sitio',           description: 'Confirma tu llegada al lugar.' },
  in_progress: { label: '🏁 Finalizar y Cerrar Servicio', description: 'Marca el trabajo como completado.' },
};

export default function JobDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrderDetail = async () => {
    try {
      const response = await fetch(`/api/orders/${id}`);
      const data = await response.json();
      if (data.success) {
        setOrder(data.order);
      } else {
        Alert.alert('Error', 'No se pudo cargar el trabajo.');
        router.back();
      }
    } catch (error) {
      console.error('[JobDetail] fetch error:', error);
      Alert.alert('Error', 'Fallo de conexión.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrderDetail(); }, [id]);

  const updateStatus = async (newStatus: OrderStatus) => {
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
        Alert.alert('✅ Actualizado', `Estado: ${ORDER_STATUS_LABEL[newStatus]}`);
      } else {
        Alert.alert('Error', data.error || 'No se pudo actualizar el estado.');
      }
    } catch (error) {
      Alert.alert('Error', 'Fallo de conexión al actualizar.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );
  }

  if (!order) {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-slate-50">
        <Text className="text-slate-500 text-center font-medium mb-4">
          No se pudo encontrar esta orden.
        </Text>
        <Button title="Volver" onPress={() => router.back()} />
      </View>
    );
  }

  const currentStatus = (order.status ?? ORDER_STATUS.PENDING) as OrderStatus;
  const nextStatus = TECHNICIAN_NEXT_STATUS[currentStatus];
  const stepConfig = nextStatus ? STEP_CONFIG[currentStatus] : null;

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      {/* Encabezado */}
      <View className="flex-row items-center mb-6 mt-2">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-slate-800">Orden #{order.order_number}</Text>
          <Text className="text-slate-500">{order.service_type}</Text>
        </View>
        <StatusBadge status={currentStatus} />
      </View>

      {/* Info cliente / dirección */}
      <Card className="mb-6">
        <Text className="font-bold text-lg mb-2 text-slate-800">
          Cliente: {order.client_name}
        </Text>
        <Text className="text-slate-600 mb-3">📍 {order.address}</Text>
        <View className="h-32 bg-slate-200 rounded-xl items-center justify-center border border-slate-300 mb-3">
          <Text className="text-slate-500 font-medium">🗺️ Mapa de Ruta</Text>
        </View>
        <Button
          title="Navegar (GPS)"
          variant="outline"
          onPress={() => Alert.alert('GPS', 'Abriendo navegación...')}
        />
      </Card>

      {/* Descripción */}
      <Text className="text-xl font-bold text-slate-800 mb-2">Descripción</Text>
      <Card className="mb-6">
        <Text className="text-slate-700 leading-relaxed">{order.description}</Text>
      </Card>

      {/* Flujo de ejecución */}
      <Text className="text-xl font-bold text-slate-800 mb-3">Flujo de Ejecución</Text>
      <Card className="mb-6 gap-3">
        {updating ? (
          <ActivityIndicator color="#1E40AF" />
        ) : (
          <>
            {/* Estado: completado */}
            {currentStatus === ORDER_STATUS.COMPLETED && (
              <View className="bg-green-50 p-4 rounded-xl border border-green-200">
                <Text className="text-green-700 font-bold text-center text-base">
                  ✅ Servicio Completado
                </Text>
                <Text className="text-green-600 text-center text-xs mt-1">
                  El cliente puede ver el reporte.
                </Text>
              </View>
            )}

            {/* Estado: cancelado */}
            {currentStatus === ORDER_STATUS.CANCELLED && (
              <View className="bg-red-50 p-4 rounded-xl border border-red-200">
                <Text className="text-red-700 font-bold text-center">❌ Orden Cancelada</Text>
              </View>
            )}

            {/* Estado: pendiente (sin asignar al técnico aún) */}
            {currentStatus === ORDER_STATUS.PENDING && (
              <View className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <Text className="text-yellow-700 text-center font-medium">
                  En espera de asignación por el administrador.
                </Text>
              </View>
            )}

            {/* Botón de acción para el técnico (flujo lineal) */}
            {stepConfig && nextStatus && (
              <View>
                <Text className="text-slate-400 text-sm mb-3 text-center">
                  {stepConfig.description}
                </Text>
                <Button
                  title={stepConfig.label}
                  onPress={() => updateStatus(nextStatus)}
                />
              </View>
            )}

            {/* BOTÓN PARA GENERAR COTIZACIÓN (Solo si está aceptado o en progreso) */}
            {(currentStatus === ORDER_STATUS.ACCEPTED || currentStatus === ORDER_STATUS.IN_PROGRESS) && (
              <Button 
                title="📝 Generar Cotización" 
                variant="outline" 
                className="mt-2"
                onPress={() => router.push({
                  pathname: '/(technician)/create-quote',
                  params: { 
                    order_id: id, 
                    client_id: order.client_id,
                    order_number: order.order_number 
                  }
                })} 
              />
            )}
          </>
        )}
      </Card>

      <View className="h-20" />
    </ScrollView>
  );
}
