import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { apiCall } from '../../../lib/api';
import { Card } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { ORDER_STATUS_LABEL, ORDER_STATUS } from '../../../lib/order-status';

export default function ServiceDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [media, setMedia] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const orderRes = await apiCall<{ order: any, media: any[] }>(`/api/orders/${id}?user_id=${user?.id}&role=${user?.role}`);
        if (orderRes.success && orderRes.data) {
          setOrder(orderRes.data.order);
          setMedia(orderRes.data.media || []);
          
          // Buscar cotizaciones vinculadas a esta orden
          const quoteRes = await apiCall<{ data: any[] }>(`/api/quotes?user_id=${user?.id}&role=${user?.role}`);
          if (quoteRes.success && quoteRes.data) {
            setQuotes(quoteRes.data.data.filter((q: any) => q.order_id === id));
          }
        } else {
          Alert.alert('Error', 'No se encontró la orden.');
          router.back();
        }
      } catch (error) {
        console.error('Fetch service detail error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <ActivityIndicator size="large" color="#1E40AF" className="mt-20" />;

  if (!order) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-slate-500 text-center font-medium">No se pudo cargar la información de esta orden.</Text>
        <Button title="Volver" onPress={() => router.back()} className="mt-4" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <View className="flex-row justify-between items-center mb-6 mt-2">
        <View className="flex-1 mr-2">
          <Text className="text-2xl font-bold text-slate-800">Orden #{order?.order_number || id}</Text>
          <Text className="text-slate-500">{order?.service_type}</Text>
        </View>
        <StatusBadge status={order?.status} />
      </View>

      <Card className="mb-6">
        <Text className="font-bold text-lg mb-2 text-slate-800">Detalles de la Solicitud</Text>
        <Text className="text-slate-600 leading-relaxed mb-4">{order.description}</Text>
        <View className="pt-4 border-t border-slate-100">
          <Text className="text-slate-400 text-xs font-bold uppercase mb-1">Dirección Registrada:</Text>
          <Text className="text-slate-700">{order.address}</Text>
        </View>
      </Card>

      <Text className="text-xl font-bold text-slate-800 mb-3">Técnico Asignado</Text>
      <Card className="mb-6 flex-row items-center border-l-4 border-primary">
        <View className="w-12 h-12 bg-slate-200 rounded-full items-center justify-center mr-4">
          <Text className="text-xl">👨‍🔧</Text>
        </View>
        <View>
          <Text className="text-lg font-bold text-slate-800">
            {order.technician_name || 'Pendiente de asignación'}
          </Text>
          <Text className="text-slate-500 text-sm">Staff Técnico CoolTrack-Pro</Text>
        </View>
      </Card>

      {quotes.length > 0 && (
        <>
          <Text className="text-xl font-bold text-slate-800 mb-3">Cotizaciones Recibidas</Text>
          <View className="mb-8">
            {quotes.map((quote) => (
              <TouchableOpacity 
                key={quote.id} 
                className="mb-3" 
                onPress={() => router.push({
                  pathname: '/(client)/quote/[id]',
                  params: { id: quote.id }
                })}
              >
                <Card className="flex-row justify-between items-center border-l-4 border-yellow-500">
                  <View>
                    <Text className="font-bold text-slate-800">{quote.quote_number}</Text>
                    <Text className="text-primary font-bold text-lg">${Number(quote.total).toFixed(2)}</Text>
                  </View>
                  <View className="items-end">
                    <StatusBadge status={quote.status} />
                    <Text className="text-primary font-bold text-xs mt-2">VER DETALLE →</Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {media.length > 0 && (
        <>
          <Text className="text-xl font-bold text-slate-800 mb-3">Evidencias Visuales</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
            {media.map((item, index) => (
              <View key={index} className="mr-3 w-40 h-40 bg-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <Image source={{ uri: item.url }} className="w-full h-full" />
              </View>
            ))}
          </ScrollView>
        </>
      )}

      <View className="h-20" />
    </ScrollView>
  );
}
