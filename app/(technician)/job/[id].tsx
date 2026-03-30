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
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [quoteStatus, setQuoteStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchData = async () => {
    try {
      if (!user?.id) return;

      // Fetch Order
      const resOrder = await fetch(`/api/orders/${id}`);
      const dataOrder = await resOrder.json();
      
      if (dataOrder.success) {
        setOrder(dataOrder.order);
        
        // Fetch Quote Status for this order
        const resQuote = await fetch(`/api/quotes?user_id=${user.id}&role=${user.role}`);
        const dataQuote = await resQuote.json();
        
        if (dataQuote.success) {
          const orderQuote = dataQuote.data.find((q: any) => q.order_id === id);
          setQuoteStatus(orderQuote ? orderQuote.status : null);
        }
      } else {
        Alert.alert('Error', 'No se pudo cargar el trabajo.');
        router.back();
      }
    } catch (error) {
      console.error('[JobDetail] fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const updateStatus = async (newStatus: OrderStatus) => {
    // Client Side Guard (mirroring backend)
    if ((newStatus === 'in_progress' || newStatus === 'completed') && quoteStatus !== 'approved') {
      Alert.alert('Bloqueado', '⚠️ No puedes iniciar el trabajo sin una cotización aprobada por el cliente.');
      return;
    }

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

  if (!order) return null;

  const currentStatus = (order.status ?? ORDER_STATUS.PENDING) as OrderStatus;
  const nextStatus = TECHNICIAN_NEXT_STATUS[currentStatus];
  const stepConfig = nextStatus ? STEP_CONFIG[currentStatus] : null;

  // Determination if work is blocked by quote status
  const isWorkBlocked = (nextStatus === 'in_progress' || nextStatus === 'completed') && quoteStatus !== 'approved';

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

      {/* Alerta de Cotización (Guardia) */}
      {(currentStatus === 'accepted' || currentStatus === 'in_transit') && (
        <Card className={`mb-6 border-0 ${quoteStatus === 'approved' ? 'bg-green-100' : 'bg-amber-100'}`}>
          <View className="flex-row items-center">
             <Text className="text-xl mr-2">{quoteStatus === 'approved' ? '✅' : '⚠️'}</Text>
             <View className="flex-1">
                <Text className={`font-bold ${quoteStatus === 'approved' ? 'text-green-800' : 'text-amber-800'}`}>
                  {quoteStatus === 'approved' ? 'Cotización Aprobada' : 'Cotización Pendiente'}
                </Text>
                <Text className={`text-xs ${quoteStatus === 'approved' ? 'text-green-600' : 'text-amber-600'}`}>
                  {quoteStatus === 'approved' 
                    ? 'Puedes proceder con el inicio del trabajo.' 
                    : 'Espera a que el cliente apruebe tu propuesta.'}
                </Text>
             </View>
          </View>
        </Card>
      )}

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
              </View>
            )}

            {/* BOTÓN DE ACCIÓN (Con Guardia) */}
            {stepConfig && nextStatus && (
              <View>
                {isWorkBlocked && (
                  <Text className="text-amber-600 text-xs font-bold mb-2 text-center">
                    ❌ Debes esperar la aprobación del cliente para continuar.
                  </Text>
                )}
                <Button
                  title={stepConfig.label}
                  disabled={isWorkBlocked}
                  onPress={() => updateStatus(nextStatus)}
                />
              </View>
            )}

            {/* BOTÓN PARA GENERAR/VER COTIZACIÓN */}
            {(currentStatus === ORDER_STATUS.ACCEPTED || currentStatus === ORDER_STATUS.IN_TRANSIT) && (
              <Button 
                title={quoteStatus ? "📋 Ver Cotización" : "📝 Generar Cotización"} 
                variant="outline" 
                className="mt-2"
                onPress={() => {
                  if (quoteStatus) {
                    // Si ya existe una cotización, ir allá (aquí podrías filtrar por ID)
                    Alert.alert('Info', 'Funcionalidad de ver cotización existente próximamente.');
                  } else {
                    router.push({
                      pathname: '/(technician)/create-quote',
                      params: { 
                        order_id: id, 
                        client_id: order.client_id,
                        order_number: order.order_number 
                      }
                    });
                  }
                }} 
              />
            )}
          </>
        )}
      </Card>

      <View className="h-20" />
    </ScrollView>
  );
}
