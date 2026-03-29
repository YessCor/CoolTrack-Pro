import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Card } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Button } from '../../../components/ui/Button';

export default function ServiceDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`);
        const data = await response.json();
        if (data.success) {
          setOrder(data.order);
          setMedia(data.media || []);
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
          <Text className="text-lg font-bold text-slate-800">{order.technician_name || 'Pendiente de asignación'}</Text>
          <Text className="text-slate-500 text-sm">Staff Técnico CoolTrack-Pro</Text>
        </View>
      </Card>

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
