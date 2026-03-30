import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';
import { ORDER_STATUS, TECHNICIAN_NEXT_STATUS, ORDER_STATUS_LABEL, OrderStatus } from '../../../lib/order-status';
import {
  MapPinIcon, UserIcon, FileTextIcon, ClipboardIcon,
  CheckCircleIcon, AlertTriangleIcon, ChevronRightIcon, MapPinIcon as NavIcon,
  AirVentIcon, LayersIcon, TagIcon,
} from '../../../components/ui/Icons';

const EQUIPMENT_TYPES: Record<string, string> = {
  split: 'Aire de ventana',
  central: 'Sistema Central',
  mini_split: 'Minisplit',
  chiller: 'Chiller',
  fan_coil: 'Fan Coil',
  other: 'Otro',
};

const STEP_CONFIG: Partial<Record<OrderStatus, { label: string; sub: string }>> = {
  assigned:    { label: 'Aceptar trabajo',         sub: 'Confirma que tomaste este servicio.' },
  accepted:    { label: 'Reportar: En camino',      sub: 'Informa que vas hacia el cliente.' },
  in_transit:  { label: 'Reportar: Llegué al sitio', sub: 'Confirma tu llegada al lugar.' },
  in_progress: { label: 'Finalizar servicio',       sub: 'Marca el trabajo como completado.' },
};

export default function JobDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [equipment, setEquipment] = useState<any>(null);
  const [quoteStatus, setQuoteStatus] = useState<string | null>(null);
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchData = async () => {
    try {
      if (!user?.id) return;
      const resOrder = await fetch(`/api/orders/${id}`);
      const dataOrder = await resOrder.json();
      if (dataOrder.success) {
        setOrder(dataOrder.order);
        
        if (dataOrder.order.equipment_id) {
          const resEquipment = await fetch(`/api/equipment/${dataOrder.order.equipment_id}`);
          const dataEquipment = await resEquipment.json();
          if (dataEquipment.success) {
            setEquipment(dataEquipment.equipment);
          }
        }
        
        const resQuote = await fetch(`/api/quotes?user_id=${user.id}&role=${user.role}`);
        const dataQuote = await resQuote.json();
        if (dataQuote.success) {
          const orderQuote = dataQuote.data.find((q: any) => q.order_id === id);
          if (orderQuote) {
            setQuoteStatus(orderQuote.status);
            setQuoteId(orderQuote.id);
          }
        }
      } else {
        Alert.alert('Error', 'No se pudo cargar el trabajo.');
        router.back();
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

  const updateStatus = async (newStatus: OrderStatus) => {
    if ((newStatus === 'in_progress' || newStatus === 'completed') && quoteStatus !== 'approved') {
      Alert.alert('Bloqueado', 'No puedes continuar sin una cotización aprobada por el cliente.');
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders?id=${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
        Alert.alert('Estado actualizado', ORDER_STATUS_LABEL[newStatus]);
      } else {
        Alert.alert('Error', data.error || 'No se pudo actualizar el estado.');
      }
    } catch { Alert.alert('Error', 'Fallo de conexión.'); }
    finally { setUpdating(false); }
  };

  if (loading) return (
    <View className="flex-1 bg-surface items-center justify-center">
      <ActivityIndicator size="large" color="#0F4C75" />
    </View>
  );

  if (!order) return null;

  const currentStatus = (order.status ?? ORDER_STATUS.PENDING) as OrderStatus;
  const nextStatus = TECHNICIAN_NEXT_STATUS[currentStatus];
  const stepConfig = nextStatus ? STEP_CONFIG[currentStatus] : null;
  const isWorkBlocked = (nextStatus === 'in_progress' || nextStatus === 'completed') && quoteStatus !== 'approved';
  const quoteApproved = quoteStatus === 'approved';
  const showQuoteAlert = currentStatus === ORDER_STATUS.ACCEPTED || currentStatus === ORDER_STATUS.IN_TRANSIT;

  return (
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Dark header */}
      <View className="bg-ink px-5 pt-5 pb-10">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 mr-3">
            <Text style={{ color: '#4A6785', fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>
              ORDEN #{order.order_number}
            </Text>
            <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '700', marginTop: 3 }}>{order.service_type}</Text>
          </View>
          <StatusBadge status={currentStatus} />
        </View>
      </View>

      <View style={{ marginTop: -20, marginHorizontal: 16, gap: 12 }}>

        {/* Quote alert banner */}
        {showQuoteAlert && (
          <View
            className="rounded-2xl px-4 py-3.5 flex-row items-center gap-3"
            style={{ backgroundColor: quoteApproved ? '#ECFDF5' : '#FFFBEB', borderWidth: 1, borderColor: quoteApproved ? '#6EE7B7' : '#FCD34D' }}
          >
            {quoteApproved
              ? <CheckCircleIcon size={20} color="#059669" />
              : <AlertTriangleIcon size={20} color="#D97706" />
            }
            <View className="flex-1">
              <Text style={{ fontWeight: '700', fontSize: 13, color: quoteApproved ? '#065F46' : '#92400E' }}>
                {quoteApproved ? 'Cotización aprobada' : 'Cotización pendiente'}
              </Text>
              <Text style={{ fontSize: 12, color: quoteApproved ? '#047857' : '#B45309', marginTop: 1 }}>
                {quoteApproved ? 'Puedes proceder con el inicio del trabajo.' : 'Espera a que el cliente apruebe tu propuesta.'}
              </Text>
            </View>
          </View>
        )}

        {/* Client & address */}
        <View className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden">
          <View className="px-4 pt-4 pb-3 flex-row items-center gap-3 border-b border-surface-border">
            <View className="w-10 h-10 rounded-full bg-brand items-center justify-center">
              <UserIcon size={18} color="#fff" />
            </View>
            <View className="flex-1">
              <Text style={{ color: '#94a3b8', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 }}>CLIENTE</Text>
              <Text style={{ color: '#0D1B2A', fontWeight: '700', fontSize: 15 }}>{order.client_name}</Text>
            </View>
          </View>
          <View className="px-4 py-3 flex-row items-center gap-2">
            <MapPinIcon size={15} color="#94a3b8" />
            <Text style={{ color: '#64748b', fontSize: 13, flex: 1 }}>{order.address}</Text>
          </View>
          {equipment && (
            <View className="px-4 py-3 border-t border-surface-border">
              <View className="flex-row items-center gap-2 mb-2">
                <AirVentIcon size={14} color="#0F4C75" />
                <Text style={{ fontWeight: '700', color: '#0F4C75', fontSize: 12 }}>EQUIPO ASIGNADO</Text>
              </View>
              <View className="bg-surface-hover rounded-lg p-3">
                <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 14 }}>
                  {equipment.name || EQUIPMENT_TYPES[equipment.type] || equipment.type}
                </Text>
                <View className="flex-row flex-wrap gap-x-4 mt-2">
                  {equipment.brand && (
                    <View className="flex-row items-center gap-1">
                      <LayersIcon size={12} color="#64748b" />
                      <Text style={{ color: '#64748b', fontSize: 12 }}>{equipment.brand}</Text>
                    </View>
                  )}
                  {equipment.model && (
                    <View className="flex-row items-center gap-1">
                      <TagIcon size={12} color="#64748b" />
                      <Text style={{ color: '#64748b', fontSize: 12 }}>{equipment.model}</Text>
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
                  <View className="flex-row items-center gap-1 mt-2">
                    <MapPinIcon size={12} color="#64748b" />
                    <Text style={{ color: '#64748b', fontSize: 12 }}>{equipment.location_description}</Text>
                  </View>
                )}
                {equipment.notes && (
                  <Text style={{ color: '#64748b', fontSize: 11, marginTop: 4, fontStyle: 'italic' }}>
                    Nota: {equipment.notes}
                  </Text>
                )}
              </View>
            </View>
          )}
          {/* Map placeholder */}
          <View style={{ height: 120, margin: 12, borderRadius: 12, backgroundColor: '#EEF2F7', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <NavIcon size={20} color="#94a3b8" />
            <Text style={{ color: '#94a3b8', fontSize: 12 }}>Mapa de ruta</Text>
          </View>
          <View className="px-4 pb-4">
            <Button
              title="Navegar con GPS"
              variant="outline"
              size="sm"
              onPress={() => Alert.alert('GPS', 'Abriendo navegación...')}
              className="w-full"
            />
          </View>
        </View>

        {/* Description */}
        <View className="bg-surface-card rounded-2xl border border-surface-border p-4">
          <View className="flex-row items-center gap-2 mb-2">
            <FileTextIcon size={15} color="#0F4C75" />
            <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 13 }}>Descripción</Text>
          </View>
          <Text style={{ color: '#64748b', fontSize: 13, lineHeight: 20 }}>{order.description}</Text>
        </View>

        {/* Action flow */}
        <View className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden">
          <View className="px-4 py-3 border-b border-surface-border flex-row items-center gap-2">
            <ClipboardIcon size={15} color="#0F4C75" />
            <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 13 }}>Flujo de ejecución</Text>
          </View>
          <View className="p-4 gap-3">
            {updating ? (
              <View className="items-center py-4">
                <ActivityIndicator color="#0F4C75" />
                <Text style={{ color: '#64748b', fontSize: 13, marginTop: 8 }}>Actualizando estado...</Text>
              </View>
            ) : (
              <>
                {/* Completed state */}
                {currentStatus === ORDER_STATUS.COMPLETED && (
                  <View className="bg-emerald-50 rounded-xl p-4 flex-row items-center gap-3 border border-emerald-100">
                    <CheckCircleIcon size={24} color="#059669" />
                    <View>
                      <Text style={{ color: '#065F46', fontWeight: '700', fontSize: 15 }}>Servicio completado</Text>
                      <Text style={{ color: '#047857', fontSize: 12, marginTop: 1 }}>El cliente puede ver el reporte.</Text>
                    </View>
                  </View>
                )}

                {/* Next action button */}
                {stepConfig && nextStatus && (
                  <View className="gap-2">
                    {isWorkBlocked && (
                      <View className="bg-amber-50 rounded-xl px-3 py-2 flex-row items-center gap-2 border border-amber-100">
                        <AlertTriangleIcon size={14} color="#D97706" />
                        <Text style={{ color: '#B45309', fontSize: 12, fontWeight: '600', flex: 1 }}>
                          Requiere cotización aprobada para continuar.
                        </Text>
                      </View>
                    )}
                    <Button
                      title={stepConfig.label}
                      disabled={isWorkBlocked}
                      size="lg"
                      onPress={() => updateStatus(nextStatus)}
                      className="w-full"
                    />
                    <Text style={{ color: '#94a3b8', fontSize: 12, textAlign: 'center' }}>{stepConfig.sub}</Text>
                  </View>
                )}

                {/* Quote button */}
                {(currentStatus === ORDER_STATUS.ACCEPTED || currentStatus === ORDER_STATUS.IN_TRANSIT) && (
                  <TouchableOpacity
                    className="flex-row items-center justify-between px-4 py-3.5 rounded-xl border border-surface-border bg-surface"
                    onPress={() => {
                      if (quoteStatus && quoteId) {
                        router.push({
                          pathname: '/(technician)/job/quote-detail',
                          params: { quote_id: quoteId },
                        });
                      } else {
                        router.push({
                          pathname: '/(technician)/create-quote',
                          params: { order_id: id, client_id: order.client_id, order_number: order.order_number },
                        });
                      }
                    }}
                  >
                    <View className="flex-row items-center gap-2">
                      <FileTextIcon size={16} color="#0F4C75" />
                      <Text style={{ color: '#0F4C75', fontWeight: '700', fontSize: 14 }}>
                        {quoteStatus ? 'Ver cotización' : 'Generar cotización'}
                      </Text>
                    </View>
                    <ChevronRightIcon size={16} color="#0F4C75" />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
