import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';
import { apiCall } from '../../../lib/api';
import { MapPinIcon, UserIcon, CalendarIcon, FileTextIcon, AirVentIcon, ChevronRightIcon, LayersIcon, TagIcon } from '../../../components/ui/Icons';

const EQUIPMENT_TYPES: Record<string, string> = {
  split: 'Aire de ventana',
  central: 'Sistema Central',
  mini_split: 'Minisplit',
  chiller: 'Chiller',
  fan_coil: 'Fan Coil',
  other: 'Otro',
};

export default function ServiceDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [equipment, setEquipment] = useState<any>(null);
  const [media, setMedia] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const orderRes = await apiCall<{ order: any; media: any[]; equipment: any }>(`/api/orders/${id}?user_id=${user?.id}&role=${user?.role}`);
        if (orderRes.success && orderRes.data) {
          setOrder(orderRes.data.order);
          setEquipment(orderRes.data.equipment || null);
          setMedia(orderRes.data.media || []);
          const quoteRes = await apiCall<{ data: any[] }>(`/api/quotes?user_id=${user?.id}&role=${user?.role}`);
          if (quoteRes.success && quoteRes.data) {
            setQuotes(quoteRes.data.data.filter((q: any) => q.order_id === id));
          }
        } else {
          Alert.alert('Error', 'No se encontró la orden.');
          router.back();
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) return (
    <View className="flex-1 bg-surface items-center justify-center">
      <ActivityIndicator size="large" color="#0F4C75" />
    </View>
  );

  if (!order) return (
    <View className="flex-1 bg-surface items-center justify-center p-6 gap-4">
      <Text style={{ color: '#64748b', textAlign: 'center', fontSize: 15 }}>No se pudo cargar la información.</Text>
      <Button title="Volver" onPress={() => router.back()} />
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Dark header */}
      <View className="bg-ink px-5 pt-5 pb-8">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 mr-3">
            <Text style={{ color: '#4A6785', fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>
              ORDEN #{order.order_number || String(id).slice(0, 8)}
            </Text>
            <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '700', marginTop: 3 }}>{order.service_type}</Text>
          </View>
          <StatusBadge status={order.status} />
        </View>
      </View>

      <View style={{ marginTop: -16, marginHorizontal: 16, gap: 12 }}>

        {/* Description */}
        <View className="bg-surface-card rounded-2xl border border-surface-border p-4">
          <View className="flex-row items-center gap-2 mb-3">
            <FileTextIcon size={16} color="#0F4C75" />
            <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 14 }}>Descripción del problema</Text>
          </View>
          <Text style={{ color: '#64748b', fontSize: 14, lineHeight: 21 }}>{order.description}</Text>
        </View>

        {/* Equipment info */}
        {equipment && (
          <View className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden">
            <View className="px-4 py-3 border-b border-surface-border flex-row items-center gap-2">
              <AirVentIcon size={16} color="#0F4C75" />
              <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 14 }}>Equipo seleccionado</Text>
            </View>
            <View className="p-4">
              <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 15 }}>
                {equipment.name || EQUIPMENT_TYPES[equipment.type] || equipment.type}
              </Text>
              <View className="flex-row flex-wrap gap-x-4 mt-2">
                {equipment.brand && (
                  <View className="flex-row items-center gap-1.5">
                    <LayersIcon size={13} color="#64748b" />
                    <Text style={{ color: '#64748b', fontSize: 12 }}>{equipment.brand} {equipment.model || ''}</Text>
                  </View>
                )}
                {equipment.serial_number && (
                  <Text style={{ color: '#64748b', fontSize: 12 }}>Serie: {equipment.serial_number}</Text>
                )}
                {equipment.capacity_tons && (
                  <Text style={{ color: '#64748b', fontSize: 12 }}>{equipment.capacity_tons} ton</Text>
                )}
              </View>
              {equipment.location_description && (
                <View className="flex-row items-center gap-1.5 mt-2">
                  <MapPinIcon size={13} color="#64748b" />
                  <Text style={{ color: '#64748b', fontSize: 12 }}>{equipment.location_description}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Details row */}
        <View className="flex-row gap-3">
          <View className="flex-1 bg-surface-card rounded-2xl border border-surface-border p-4 gap-2">
            <MapPinIcon size={16} color="#94a3b8" />
            <Text style={{ color: '#94a3b8', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 }}>DIRECCIÓN</Text>
            <Text style={{ color: '#0D1B2A', fontSize: 13, fontWeight: '600', lineHeight: 18 }}>{order.address}</Text>
          </View>
          <View className="flex-1 bg-surface-card rounded-2xl border border-surface-border p-4 gap-2">
            <CalendarIcon size={16} color="#94a3b8" />
            <Text style={{ color: '#94a3b8', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 }}>FECHA</Text>
            <Text style={{ color: '#0D1B2A', fontSize: 13, fontWeight: '600' }}>
              {new Date(order.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
            </Text>
          </View>
        </View>

        {/* Technician */}
        <View className="bg-surface-card rounded-2xl border overflow-hidden" style={{ borderLeftWidth: 3, borderLeftColor: '#0F4C75', borderColor: '#E2E8F0' }}>
          <View className="px-4 py-4 flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-full bg-brand items-center justify-center">
              <UserIcon size={22} color="#fff" />
            </View>
            <View className="flex-1">
              <Text style={{ color: '#94a3b8', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 }}>TÉCNICO ASIGNADO</Text>
              <Text style={{ color: '#0D1B2A', fontSize: 15, fontWeight: '700', marginTop: 1 }}>
                {order.technician_name || 'Pendiente de asignación'}
              </Text>
              <Text style={{ color: '#64748b', fontSize: 12, marginTop: 1 }}>Staff Técnico CoolTrack</Text>
            </View>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: order.technician_name ? '#10B981' : '#F59E0B' }} />
          </View>
        </View>

        {/* Quotes */}
        {quotes.length > 0 && (
          <View className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden">
            <View className="px-4 py-3 border-b border-surface-border flex-row items-center gap-2">
              <FileTextIcon size={16} color="#0F4C75" />
              <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 14 }}>Cotizaciones recibidas</Text>
            </View>
            {quotes.map((quote) => (
              <TouchableOpacity
                key={quote.id}
                onPress={() => router.push({ pathname: '/(client)/quote/[id]', params: { id: quote.id } })}
                className="flex-row items-center justify-between px-4 py-3.5 border-b border-surface-border"
              >
                <View>
                  <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 14 }}>{quote.display_quote_number}</Text>
                  <Text style={{ color: '#0F4C75', fontWeight: '800', fontSize: 16, marginTop: 1 }}>
                    ${Number(quote.total).toFixed(2)}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <StatusBadge status={quote.status} />
                  <ChevronRightIcon size={16} color="#94a3b8" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Media */}
        {media.length > 0 && (
          <View className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden">
            <View className="px-4 py-3 border-b border-surface-border flex-row items-center gap-2">
              <AirVentIcon size={16} color="#0F4C75" />
              <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 14 }}>Evidencias visuales</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 12, gap: 10 }}>
              {media.map((m: any) => (
                <Image key={m.id} source={{ uri: m.url }} style={{ width: 160, height: 120, borderRadius: 12 }} resizeMode="cover" />
              ))}
            </ScrollView>
          </View>
        )}

        <Button title="Volver a mis solicitudes" variant="outline" onPress={() => router.back()} className="w-full" />
      </View>
    </ScrollView>
  );
}
