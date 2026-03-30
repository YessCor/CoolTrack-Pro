import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { FileTextIcon, ClipboardIcon, UserIcon, CheckCircleIcon, AlertTriangleIcon } from '../../../components/ui/Icons';

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface Quote {
  id: string;
  display_quote_number: string;
  status: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes: string | null;
  client_name: string;
  technician_name: string;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  sent:     { label: 'Enviada al cliente',  color: '#B45309', bg: '#FFFBEB', border: '#FCD34D', icon: <AlertTriangleIcon size={18} color="#D97706" /> },
  approved: { label: 'Aprobada',            color: '#065F46', bg: '#ECFDF5', border: '#6EE7B7', icon: <CheckCircleIcon size={18} color="#059669" /> },
  rejected: { label: 'Rechazada',           color: '#991B1B', bg: '#FEF2F2', border: '#FECACA', icon: <AlertTriangleIcon size={18} color="#DC2626" /> },
  draft:    { label: 'Borrador',            color: '#374151', bg: '#F9FAFB', border: '#E5E7EB', icon: <FileTextIcon size={18} color="#6B7280" /> },
  expired:  { label: 'Expirada',            color: '#374151', bg: '#F9FAFB', border: '#E5E7EB', icon: <AlertTriangleIcon size={18} color="#6B7280" /> },
};

export default function QuoteDetail() {
  const { quote_id } = useLocalSearchParams<{ quote_id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/quotes/${quote_id}?user_id=${user?.id}&role=${user?.role}`);
        const data = await res.json();
        if (data.success) {
          setQuote(data.quote);
          setItems(data.items ?? []);
        } else {
          Alert.alert('Error', data.error || 'No se pudo cargar la cotización.');
          router.back();
        }
      } catch {
        Alert.alert('Error de conexión', 'No se pudo contactar el servidor.');
        router.back();
      } finally {
        setLoading(false);
      }
    };
    if (quote_id && user?.id) load();
  }, [quote_id]);

  if (loading) return (
    <View style={{ flex: 1, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color="#0F4C75" />
    </View>
  );

  if (!quote) return null;

  const statusCfg = STATUS_CONFIG[quote.status] ?? STATUS_CONFIG.draft;
  const createdAt = new Date(quote.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F1F5F9' }} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Dark header */}
      <View style={{ backgroundColor: '#0D1B2A', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <FileTextIcon size={15} color="#00B4D8" />
          <Text style={{ color: '#00B4D8', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 }}>
            {quote.display_quote_number}
          </Text>
        </View>
        <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '700' }}>Detalle de cotización</Text>
        <Text style={{ color: '#4A6785', fontSize: 13, marginTop: 3 }}>Generada el {createdAt}</Text>
      </View>

      <View style={{ marginTop: -20, marginHorizontal: 16, gap: 12 }}>

        {/* Estado */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 12,
          backgroundColor: statusCfg.bg, borderRadius: 16, padding: 14,
          borderWidth: 1, borderColor: statusCfg.border,
        }}>
          {statusCfg.icon}
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '700', fontSize: 14, color: statusCfg.color }}>
              Estado: {statusCfg.label}
            </Text>
            {quote.status === 'sent' && (
              <Text style={{ fontSize: 12, color: statusCfg.color, marginTop: 2 }}>
                Esperando respuesta del cliente.
              </Text>
            )}
          </View>
        </View>

        {/* Cliente */}
        <View style={{
          backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1,
          borderColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center',
          padding: 14, gap: 12,
        }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#0F4C75', alignItems: 'center', justifyContent: 'center' }}>
            <UserIcon size={18} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#94a3b8', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 }}>CLIENTE</Text>
            <Text style={{ color: '#0D1B2A', fontWeight: '700', fontSize: 15 }}>{quote.client_name}</Text>
          </View>
        </View>

        {/* Ítems */}
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
            <ClipboardIcon size={15} color="#0F4C75" />
            <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 14 }}>Conceptos</Text>
            <View style={{ marginLeft: 'auto', backgroundColor: '#0F4C75', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{items.length}</Text>
            </View>
          </View>

          {items.map((item, idx) => (
            <View
              key={item.id}
              style={{
                flexDirection: 'row', alignItems: 'center',
                paddingHorizontal: 16, paddingVertical: 12,
                borderBottomWidth: idx < items.length - 1 ? 1 : 0,
                borderBottomColor: '#E2E8F0',
              }}
            >
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={{ fontWeight: '600', color: '#0D1B2A', fontSize: 14 }}>{item.description}</Text>
                <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>
                  {item.quantity} × ${Number(item.unit_price).toFixed(2)}
                </Text>
              </View>
              <Text style={{ fontWeight: '700', color: '#0F4C75', fontSize: 15 }}>
                ${Number(item.total).toFixed(2)}
              </Text>
            </View>
          ))}

          {/* Totales */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 14, gap: 8, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: '#64748b', fontSize: 13 }}>Subtotal</Text>
              <Text style={{ color: '#0D1B2A', fontWeight: '600', fontSize: 13 }}>${Number(quote.subtotal).toFixed(2)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: '#64748b', fontSize: 13 }}>IVA ({Math.round((quote.tax_rate ?? 0.16) * 100)}%)</Text>
              <Text style={{ color: '#0D1B2A', fontWeight: '600', fontSize: 13 }}>${Number(quote.tax_amount).toFixed(2)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, marginTop: 4, borderTopWidth: 1, borderTopColor: '#E2E8F0' }}>
              <Text style={{ color: '#0D1B2A', fontWeight: '800', fontSize: 17 }}>Total</Text>
              <Text style={{ color: '#0F4C75', fontWeight: '800', fontSize: 20 }}>${Number(quote.total).toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Notas */}
        {quote.notes && (
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', padding: 16 }}>
            <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 13, marginBottom: 6 }}>Notas</Text>
            <Text style={{ color: '#64748b', fontSize: 13, lineHeight: 20 }}>{quote.notes}</Text>
          </View>
        )}

        <Button title="Volver" variant="outline" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}
