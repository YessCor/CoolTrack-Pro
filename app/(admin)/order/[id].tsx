import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, FlatList, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { ORDER_STATUS, OrderStatus } from '../../../lib/order-status';
import { QUOTE_STATUS_LABELS } from '../../../lib/models/quote';
import { QuoteStatus } from '../../../lib/types';
import { MapPinIcon, UserIcon, ClipboardIcon, XIcon, UsersIcon, FileTextIcon, WrenchIcon, ArrowLeftIcon } from '../../../components/ui/Icons';
import { apiCall } from '../../../lib/api';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [quote, setQuote] = useState<any>(null);
  const [techs, setTechs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [showTechModal, setShowTechModal] = useState(false);

  const fetchOrder = async () => {
    if (!user || !id) return;
    try {
      const res = await fetch(`/api/orders/${id}?_=${Date.now()}`, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.order || null);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchTechs = async () => {
    try {
      const res = await fetch('/api/admin/technicians');
      const data = await res.json();
      if (data.success) setTechs(data.technicians);
    } catch (e) { console.error(e); }
  };

  const fetchQuote = async () => {
    if (!user || !id) return;
    setLoadingQuote(true);
    try {
      const { success, data } = await apiCall<{ data: any[] }>(`/api/quotes?user_id=${user.id}&role=admin`);
      if (success && data?.data) {
        const found = data.data.find((q: any) => q.order_id === id);
        setQuote(found || null);
      }
    } catch (e) { console.error(e); setQuote(null); }
    finally { setLoadingQuote(false); }
  };

  useEffect(() => {
    fetchOrder();
    fetchTechs();
    fetchQuote();
    const interval = setInterval(() => {
      fetchOrder();
      fetchQuote();
    }, 10000);
    return () => clearInterval(interval);
  }, [id, user]);

  const checkQuoteApproved = async (orderId: string): Promise<boolean> => {
    if (quote?.status === 'approved') return true;
    try {
      const { success, data } = await apiCall<{ data: any[] }>(`/api/quotes?user_id=${user?.id}&role=admin`);
      if (success && data?.data) {
        const approved = data.data.find((q: any) => q.order_id === orderId && q.status === 'approved');
        return !!approved;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  const handleAssign = async (techId: string) => {
    if (!order) return;
    
    const hasApprovedQuote = await checkQuoteApproved(order.id);
    if (!hasApprovedQuote) {
      Alert.alert('Cotización requerida', 'Primero debes crear una cotización y esperar que el cliente la apruebe.');
      setShowTechModal(false);
      return;
    }

    try {
      const res = await fetch('/api/assign-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: order.id, technician_id: techId }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert('Asignado', 'Técnico asignado correctamente.');
        setShowTechModal(false);
        fetchOrder();
      } else {
        Alert.alert('Error', data.error || 'Fallo al asignar.');
      }
    } catch { Alert.alert('Error de red', 'No se pudo conectar.'); }
  };

  if (loading) return (
    <View className="flex-1 bg-surface items-center justify-center">
      <ActivityIndicator size="large" color="#0F4C75" />
    </View>
  );

  if (!order) return (
    <View className="flex-1 bg-surface items-center justify-center">
      <Text style={{ color: '#64748b' }}>Orden no encontrada</Text>
      <Button title="Volver" variant="ghost" onPress={() => router.back()} className="mt-4" />
    </View>
  );

  return (
    <>
      <ScrollView className="flex-1 bg-surface">
        {/* Header */}
        <View className="bg-ink px-5 pt-5 pb-6">
          <View className="flex-row items-center gap-3 mb-4">
            <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-white/10 items-center justify-center">
              <ArrowLeftIcon size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={{ color: '#4A6785', fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>#{order.order_number}</Text>
          </View>
          <View className="flex-row items-start justify-between">
            <View className="flex-1 mr-3">
              <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '800' }}>{order.service_type}</Text>
              <View className="flex-row items-center gap-1.5 mt-2">
                <MapPinIcon size={13} color="#4A6785" />
                <Text style={{ color: '#4A6785', fontSize: 12 }} numberOfLines={1}>{order.address}</Text>
              </View>
            </View>
            <StatusBadge status={order.status} />
          </View>
        </View>

        <View style={{ marginTop: -16, marginHorizontal: 16, gap: 12 }}>
          {/* Description */}
          <View className="bg-surface-card rounded-2xl border border-surface-border p-4">
            <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 14, marginBottom: 8 }}>Descripción</Text>
            <Text style={{ color: '#64748b', fontSize: 14, lineHeight: 20 }}>{order.description}</Text>
          </View>

          {/* Client */}
          <View className="bg-surface-card rounded-2xl border border-surface-border p-4">
            <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 14, marginBottom: 8 }}>Cliente</Text>
            <View className="flex-row items-center gap-2">
              <UserIcon size={16} color="#0F4C75" />
              <Text style={{ fontWeight: '600', color: '#0D1B2A' }}>{order.client_name}</Text>
            </View>
          </View>

          {/* Technician */}
          <View className="bg-surface-card rounded-2xl border border-surface-border p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 14 }}>Técnico</Text>
              {!order.technician_name && quote?.status === 'approved' && (
                <Button
                  title="Asignar"
                  size="sm"
                  variant="primary"
                  icon={<UsersIcon size={12} color="#fff" />}
                  onPress={() => setShowTechModal(true)}
                />
              )}
            </View>
            {order.technician_name ? (
              <View className="flex-row items-center gap-2">
                <UserIcon size={16} color="#0F4C75" />
                <Text style={{ fontWeight: '600', color: '#0D1B2A' }}>{order.technician_name}</Text>
              </View>
            ) : (
              <Text style={{ color: '#94a3b8', fontSize: 13 }}>
                {quote?.status === 'approved' ? 'Pendiente de asignación' : 'Esperando aprobación de cotización'}
              </Text>
            )}
          </View>

          {/* Quote */}
          <View className="bg-surface-card rounded-2xl border border-surface-border p-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 14 }}>Cotización</Text>
              {!quote && !loadingQuote && order.status === ORDER_STATUS.PENDING && (
                <Button 
                  title="Crear" 
                  size="sm" 
                  variant="primary"
                  icon={<FileTextIcon size={12} color="#fff" />}
                  onPress={() => router.push({ pathname: '/(admin)/quote/new', params: { order_id: order.id } } as any)}
                />
              )}
            </View>
            
            {loadingQuote ? (
              <ActivityIndicator size="small" color="#0F4C75" />
            ) : quote ? (
              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text style={{ fontSize: 12, color: '#64748b' }}>Folio</Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#0D1B2A' }}>#{quote.display_quote_number || quote.quote_number}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text style={{ fontSize: 12, color: '#64748b' }}>Estado</Text>
                  <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: quote.status === 'approved' ? '#dcfce7' : quote.status === 'rejected' ? '#fee2e2' : '#fef3c7' }}>
                    <Text style={{ fontSize: 10, fontWeight: '600', color: quote.status === 'approved' ? '#16a34a' : quote.status === 'rejected' ? '#dc2626' : '#d97706' }}>
                      {QUOTE_STATUS_LABELS[quote.status as QuoteStatus]}
                    </Text>
                  </View>
                </View>
                {quote.items?.length > 0 && (
                  <View className="mt-2 pt-2 border-t border-surface-border gap-1">
                    {quote.items.map((item: any, idx: number) => (
                      <View key={idx} className="flex-row justify-between">
                        <Text style={{ fontSize: 12, color: '#64748b', flex: 1 }}>{item.description}</Text>
                        <Text style={{ fontSize: 12, fontWeight: '600', color: '#0D1B2A' }}>${Number(item.total || 0).toFixed(2)}</Text>
                      </View>
                    ))}
                  </View>
                )}
                <View className="flex-row justify-between pt-2 border-t border-surface-border">
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#0D1B2A' }}>Total</Text>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F4C75' }}>${Number(quote.total || 0).toFixed(2)}</Text>
                </View>
              </View>
            ) : (
              <Text style={{ color: '#94a3b8', fontSize: 13 }}>Sin cotización asociada</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Technician Selection Modal */}
      {showTechModal && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(13,27,42,0.75)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#F8FAFC', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40 }}>
            <View className="px-5 pt-5 pb-4 flex-row items-center justify-between border-b border-surface-border">
              <Text style={{ fontSize: 17, fontWeight: '700', color: '#0D1B2A' }}>Seleccionar técnico</Text>
              <TouchableOpacity onPress={() => setShowTechModal(false)}>
                <XIcon size={22} color="#64748b" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={techs.filter(t => t.is_active)}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={{ padding: 12, gap: 8 }}
              renderItem={({ item }) => {
                const isBusy = item.is_busy;
                return (
                  <TouchableOpacity
                    onPress={() => !isBusy && handleAssign(item.id)}
                    disabled={isBusy}
                    className={`flex-row items-center gap-3 px-4 py-3.5 rounded-xl border ${
                      isBusy ? 'bg-gray-100 border-gray-200 opacity-60' : 'bg-surface-card border-surface-border'
                    }`}
                  >
                    <View className={`w-10 h-10 rounded-full items-center justify-center ${isBusy ? 'bg-gray-400' : 'bg-brand'}`}>
                      <UserIcon size={18} color="#fff" />
                    </View>
                    <View className="flex-1">
                      <Text style={{ fontWeight: '700', color: isBusy ? '#9CA3AF' : '#0D1B2A', fontSize: 14 }}>{item.name}</Text>
                      <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 1 }}>{item.email}</Text>
                    </View>
                    {isBusy ? (
                      <View className="px-2 py-1 rounded-full bg-red-100">
                        <Text style={{ color: '#EF4444', fontSize: 10, fontWeight: '600' }}>Ocupado</Text>
                      </View>
                    ) : (
                      <View className="w-2 h-2 rounded-full bg-green-500" />
                    )}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View className="py-8 items-center">
                  <Text style={{ color: '#64748b', fontSize: 14 }}>No hay técnicos disponibles</Text>
                </View>
              }
            />
          </View>
        </View>
      )}
    </>
  );
}
