import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { apiCall } from '../../lib/api';
import { QuoteStatus } from '../../lib/types';
import { FileTextIcon, UserIcon, CalendarIcon, CheckCircleIcon, AlertTriangleIcon } from '../../components/ui/Icons';

const FILTERS: Array<'ALL' | QuoteStatus> = ['ALL', 'draft', 'sent', 'approved', 'rejected', 'expired'];
const FILTER_LABELS: Record<string, string> = {
  ALL: 'Todos', draft: 'Borrador', sent: 'Enviado',
  approved: 'Aprobado', rejected: 'Rechazado', expired: 'Expirado',
};

export default function AdminQuotes() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'ALL' | QuoteStatus>('ALL');
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const { success, data, error } = await apiCall<{ data: any[] }>(`/api/quotes?user_id=${user?.id}&role=${user?.role}`);
      if (success && data) setQuotes(data.data);
      else console.error('[ADMIN-QUOTES] error:', error);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchQuotes(); }, []);

  const filtered = quotes.filter(q => filter === 'ALL' || q.status === filter);
  const pendingTotal = quotes.filter(q => q.status === 'sent').reduce((a, q) => a + Number(q.total), 0);
  const approvedTotal = quotes.filter(q => q.status === 'approved').reduce((a, q) => a + Number(q.total), 0);

  return (
    <View className="flex-1 bg-surface">
      {/* Stats bar */}
      <View className="bg-surface-card border-b border-surface-border px-4 py-4">
        <View className="flex-row gap-3 mb-3">
          <View className="flex-1 rounded-xl px-4 py-3 border" style={{ backgroundColor: '#FFFBEB', borderColor: '#FCD34D' }}>
            <View className="flex-row items-center gap-1.5 mb-1">
              <AlertTriangleIcon size={13} color="#D97706" />
              <Text style={{ color: '#D97706', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 }}>POR APROBAR</Text>
            </View>
            <Text style={{ color: '#92400E', fontWeight: '800', fontSize: 18 }}>${pendingTotal.toLocaleString()}</Text>
          </View>
          <View className="flex-1 rounded-xl px-4 py-3 border" style={{ backgroundColor: '#ECFDF5', borderColor: '#6EE7B7' }}>
            <View className="flex-row items-center gap-1.5 mb-1">
              <CheckCircleIcon size={13} color="#059669" />
              <Text style={{ color: '#059669', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 }}>APROBADO</Text>
            </View>
            <Text style={{ color: '#065F46', fontWeight: '800', fontSize: 18 }}>${approvedTotal.toLocaleString()}</Text>
          </View>
        </View>

        {/* Filter pills */}
        <FlatList
          data={FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={i => i}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => {
            const active = filter === item;
            return (
              <TouchableOpacity
                onPress={() => setFilter(item)}
                className="px-4 py-2 rounded-xl border"
                style={{ backgroundColor: active ? '#0F4C75' : '#FFFFFF', borderColor: active ? '#0F4C75' : '#E2E8F0' }}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: active ? '#fff' : '#64748b' }}>
                  {FILTER_LABELS[item]}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0F4C75" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          onRefresh={fetchQuotes}
          refreshing={loading}
          renderItem={({ item }) => (
            <View className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden">
              <View className="px-4 pt-4 pb-3 flex-row items-start justify-between border-b border-surface-border">
                <View className="flex-1 mr-3">
                  <Text style={{ fontWeight: '800', color: '#0F4C75', fontSize: 13, letterSpacing: 0.5 }}>
                    {item.display_quote_number}
                  </Text>
                  <Text style={{ color: '#94a3b8', fontSize: 11, marginTop: 1 }}>#{item.id.slice(0, 8)}</Text>
                </View>
                <StatusBadge status={item.status} />
              </View>
              <View className="px-4 py-3 gap-2">
                <View className="flex-row items-center gap-2">
                  <UserIcon size={14} color="#94a3b8" />
                  <Text style={{ color: '#64748b', fontSize: 13, fontWeight: '600' }}>
                    {item.client_name || 'Sin cliente'}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <CalendarIcon size={13} color="#94a3b8" />
                    <Text style={{ color: '#94a3b8', fontSize: 12 }}>
                      {new Date(item.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </Text>
                  </View>
                  <Text style={{ color: '#0F4C75', fontWeight: '800', fontSize: 18 }}>
                    ${Number(item.total).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View className="items-center py-20 gap-3">
              <View className="w-16 h-16 rounded-2xl bg-surface-hover items-center justify-center">
                <FileTextIcon size={28} color="#94a3b8" />
              </View>
              <Text style={{ color: '#94a3b8', fontWeight: '600', fontSize: 14 }}>Sin cotizaciones en este estado</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
