import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { apiCall } from '../../../lib/api';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { FileTextIcon, UserIcon, CheckCircleIcon, XIcon } from '../../../components/ui/Icons';

export default function QuoteDetailClient() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchDetail = async () => {
    try {
      const { success, data: d, error } = await apiCall<{ quote: any; items: any[] }>(`/api/quotes/${id}?user_id=${user?.id}&role=${user?.role}`);
      if (success && d) setData(d);
      else { Alert.alert('Error', error || 'Cotización no encontrada.'); router.back(); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDetail(); }, [id]);

  const updateStatus = (newStatus: 'approved' | 'rejected') => {
    const action = newStatus === 'approved' ? 'aprobar' : 'rechazar';
    Alert.alert(
      newStatus === 'approved' ? 'Aprobar cotización' : 'Rechazar cotización',
      `¿Deseas ${action} esta propuesta de servicio?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: newStatus === 'approved' ? 'Sí, aprobar' : 'Sí, rechazar',
          style: newStatus === 'rejected' ? 'destructive' : 'default',
          onPress: async () => {
            setUpdating(true);
            try {
              const { success, error } = await apiCall(`/api/quotes/${id}?user_id=${user?.id}&role=${user?.role}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus }),
              });
              if (success) { Alert.alert('Actualizado', `La cotización fue ${newStatus === 'approved' ? 'aprobada' : 'rechazada'}.`); fetchDetail(); }
              else Alert.alert('Error', error || 'No se pudo actualizar.');
            } catch { Alert.alert('Error', 'Fallo de conexión.'); }
            finally { setUpdating(false); }
          },
        },
      ]
    );
  };

  if (loading) return (
    <View className="flex-1 bg-surface items-center justify-center">
      <ActivityIndicator size="large" color="#0F4C75" />
    </View>
  );

  if (!data?.quote) return null;
  const { quote, items } = data;

  return (
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Dark header */}
      <View className="bg-ink px-5 pt-5 pb-10">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 mr-3">
            <Text style={{ color: '#4A6785', fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>
              {quote.display_quote_number}
            </Text>
            <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '700', marginTop: 3 }}>Cotización de servicio</Text>
            <View className="flex-row items-center gap-2 mt-2">
              <UserIcon size={13} color="#4A6785" />
              <Text style={{ color: '#4A6785', fontSize: 13 }}>Técnico: {quote.technician_name}</Text>
            </View>
          </View>
          <StatusBadge status={quote.status} />
        </View>
      </View>

      <View style={{ marginTop: -20, marginHorizontal: 16, gap: 12 }}>

        {/* Items */}
        <View className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden">
          <View className="px-4 py-3 border-b border-surface-border flex-row items-center gap-2">
            <FileTextIcon size={15} color="#0F4C75" />
            <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 14 }}>Conceptos de la propuesta</Text>
          </View>
          {items.map((item: any, idx: number) => (
            <View
              key={item.id}
              className="flex-row items-start px-4 py-3"
              style={{ borderBottomWidth: idx === items.length - 1 ? 0 : 1, borderBottomColor: '#E2E8F0' }}
            >
              <View className="flex-1 mr-4">
                <Text style={{ fontWeight: '600', color: '#0D1B2A', fontSize: 14 }}>{item.description}</Text>
                <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>
                  {item.quantity} × ${Number(item.unit_price).toFixed(2)}
                </Text>
              </View>
              <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 15 }}>
                ${Number(item.total).toFixed(2)}
              </Text>
            </View>
          ))}

          {/* Totals */}
          <View className="px-4 py-4 bg-surface border-t border-surface-border gap-2">
            <View className="flex-row justify-between">
              <Text style={{ color: '#64748b', fontSize: 13 }}>Subtotal</Text>
              <Text style={{ color: '#0D1B2A', fontWeight: '600', fontSize: 13 }}>${Number(quote.subtotal).toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text style={{ color: '#64748b', fontSize: 13 }}>IVA (16%)</Text>
              <Text style={{ color: '#0D1B2A', fontWeight: '600', fontSize: 13 }}>${Number(quote.tax_amount).toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between pt-2 mt-1 border-t border-surface-border">
              <Text style={{ color: '#0D1B2A', fontWeight: '800', fontSize: 16 }}>Total a pagar</Text>
              <Text style={{ color: '#0F4C75', fontWeight: '800', fontSize: 22 }}>${Number(quote.total).toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {quote.notes && (
          <View className="bg-surface-card rounded-2xl border border-surface-border p-4">
            <Text style={{ color: '#94a3b8', fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 6 }}>NOTAS DEL TÉCNICO</Text>
            <Text style={{ color: '#64748b', fontSize: 13, lineHeight: 20, fontStyle: 'italic' }}>"{quote.notes}"</Text>
          </View>
        )}

        {/* Actions */}
        {updating ? (
          <View className="items-center py-4">
            <ActivityIndicator color="#0F4C75" />
            <Text style={{ color: '#64748b', fontSize: 13, marginTop: 8 }}>Procesando...</Text>
          </View>
        ) : quote.status === 'sent' ? (
          <View className="gap-3">
            <Button
              title="Aprobar cotización"
              size="lg"
              icon={<CheckCircleIcon size={18} color="#fff" />}
              onPress={() => updateStatus('approved')}
              className="w-full"
            />
            <Button
              title="Rechazar"
              variant="outline"
              icon={<XIcon size={18} color="#0F4C75" />}
              onPress={() => updateStatus('rejected')}
              className="w-full"
            />
          </View>
        ) : (
          <View
            className="rounded-2xl px-5 py-5 items-center gap-2"
            style={{ backgroundColor: quote.status === 'approved' ? '#ECFDF5' : '#F1F5F9', borderWidth: 1, borderColor: quote.status === 'approved' ? '#6EE7B7' : '#E2E8F0' }}
          >
            {quote.status === 'approved'
              ? <CheckCircleIcon size={28} color="#059669" />
              : <XIcon size={28} color="#94a3b8" />
            }
            <Text style={{ fontWeight: '700', fontSize: 15, color: quote.status === 'approved' ? '#065F46' : '#64748b' }}>
              Cotización {quote.status === 'approved' ? 'aprobada' : quote.status === 'rejected' ? 'rechazada' : quote.status}
            </Text>
            <Text style={{ color: '#94a3b8', fontSize: 12 }}>
              Actualizado: {new Date(quote.updated_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
            </Text>
          </View>
        )}

        <Button title="Volver" variant="ghost" onPress={() => router.back()} className="w-full" />
      </View>
    </ScrollView>
  );
}
