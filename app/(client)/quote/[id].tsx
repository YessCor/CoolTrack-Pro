import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { apiCall } from '../../../lib/api';
import { Card } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Button } from '../../../components/ui/Button';

export default function QuoteDetailClient() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchDetail = async () => {
    try {
      const { success, data, error } = await apiCall<{ quote: any, items: any[] }>(`/api/quotes/${id}?user_id=${user?.id}&role=${user?.role}`);
      if (success && data) {
        setData(data);
      } else {
        Alert.alert('Error', error || 'Cotización no encontrada.');
        router.back();
      }
    } catch (error) {
      console.error('Fetch quote error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDetail(); }, [id]);

  const updateStatus = async (newStatus: 'approved' | 'rejected') => {
    const action = newStatus === 'approved' ? 'Aprobar' : 'Rechazar';
    
    Alert.alert(
      `${action} Cotización`,
      `¿De verdad deseas ${action.toLowerCase()} esta propuesta de servicio?`,
      [
        { text: 'No, esperar', style: 'cancel' },
        { 
          text: `Sí, ${action}`, 
          onPress: async () => {
            setUpdating(true);
            try {
              const { success, error } = await apiCall(`/api/quotes/${id}?user_id=${user?.id}&role=${user?.role}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus })
              });
              if (success) {
                Alert.alert('✅ Éxito', `La cotización ha sido ${newStatus === 'approved' ? 'aprobada' : 'rechazada'}.`);
                fetchDetail();
              } else {
                Alert.alert('Error', error || 'No se pudo actualizar.');
              }
            } catch (error) {
              Alert.alert('Error', 'Fallo de conexión.');
            } finally {
              setUpdating(false);
            }
          }
        }
      ]
    );
  };

  if (loading) return (
    <View className="flex-1 items-center justify-center bg-slate-50">
      <ActivityIndicator size="large" color="#1E40AF" />
    </View>
  );

  if (!data?.quote) return null;

  const { quote, items } = data;

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <View className="flex-row justify-between items-center mb-6 mt-4">
        <View className="flex-1 mr-2">
          <Text className="text-2xl font-bold text-slate-800">Cotización #{quote.display_quote_number}</Text>
          <Text className="text-slate-500">Técnico: {quote.technician_name}</Text>
        </View>
        <StatusBadge status={quote.status} />
      </View>

      <Text className="text-xl font-bold text-slate-800 mb-3">Conceptos</Text>
      <Card className="mb-6">
        {items.map((item: any) => (
          <View key={item.id} className="flex-row justify-between items-start mb-4 pb-4 border-b border-slate-50">
            <View className="flex-1 mr-2">
              <Text className="font-bold text-slate-800">{item.description}</Text>
              <Text className="text-slate-500 text-xs">Cant: {item.quantity} x ${Number(item.unit_price).toFixed(2)}</Text>
            </View>
            <Text className="font-bold text-slate-900">${Number(item.total).toFixed(2)}</Text>
          </View>
        ))}

        <View className="pt-2">
          <View className="flex-row justify-between mb-1">
            <Text className="text-slate-500">Subtotal</Text>
            <Text className="text-slate-700">${Number(quote.subtotal).toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-slate-500">IVA (16%)</Text>
            <Text className="text-slate-700">${Number(quote.tax_amount).toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between pt-3 border-t border-slate-100">
            <Text className="font-bold text-xl text-slate-800">Total a Pagar</Text>
            <Text className="font-bold text-2xl text-primary">${Number(quote.total).toFixed(2)}</Text>
          </View>
        </View>
      </Card>

      {quote.notes && (
        <>
          <Text className="text-xl font-bold text-slate-800 mb-2">Notas del Técnico</Text>
          <Card className="mb-6 bg-slate-100 border-0">
            <Text className="text-slate-600 italic">"{quote.notes}"</Text>
          </Card>
        </>
      )}

      {quote.status === 'sent' && !updating && (
        <View className="mb-10 gap-3">
          <Button 
            title="✅ Aprobar y Proceder" 
            onPress={() => updateStatus('approved')} 
          />
          <Button 
            title="❌ Rechazar" 
            variant="outline" 
            onPress={() => updateStatus('rejected')} 
          />
        </View>
      )}

      {updating && <ActivityIndicator color="#1E40AF" size="large" className="mb-10" />}

      {quote.status !== 'sent' && (
        <View className={`p-6 rounded-3xl mb-10 items-center ${quote.status === 'approved' ? 'bg-green-50 border border-green-200' : 'bg-slate-100'}`}>
          <Text className={`font-bold text-lg ${quote.status === 'approved' ? 'text-green-700' : 'text-slate-500'}`}>
            Esta cotización ya fue {quote.status === 'approved' ? 'APROBADA' : quote.status.toUpperCase()}
          </Text>
          <Text className="text-slate-400 text-xs mt-1">Fecha de actualización: {new Date(quote.updated_at).toLocaleDateString()}</Text>
        </View>
      )}

      <View className="h-10" />
    </ScrollView>
  );
}
