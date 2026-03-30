import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { apiCall } from '../../lib/api';
import { QuoteStatus } from '../../lib/types';

export default function AdminQuotes() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'ALL' | QuoteStatus>('ALL');
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const filters: Array<'ALL' | QuoteStatus> = ['ALL', 'draft', 'sent', 'approved', 'rejected', 'expired'];

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const { success, data, error } = await apiCall<{ data: any[] }>(`/api/quotes?user_id=${user?.id}&role=${user?.role}`);
      if (success && data) {
        setQuotes(data.data);
      } else {
        console.error('[ADMIN-QUOTES] Fetch error:', error);
      }
    } catch (error) {
      console.error('Fetch quotes admin error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuotes(); }, []);

  const filteredQuotes = quotes.filter(q => 
    filter === 'ALL' || q.status === filter
  );

  const stats = {
    pending: quotes.filter(q => q.status === 'sent').reduce((acc, q) => acc + Number(q.total), 0),
    approved: quotes.filter(q => q.status === 'approved').reduce((acc, q) => acc + Number(q.total), 0),
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-slate-800 mb-4">Pipeline Comercial</Text>
        
        <View className="flex-row gap-3 mb-6">
          <Card className="flex-1 bg-yellow-50 border-yellow-100">
            <Text className="text-yellow-700 font-bold text-xs uppercase mb-1">Por Aprobar</Text>
            <Text className="text-xl font-bold text-slate-800">${stats.pending.toLocaleString()}</Text>
          </Card>
          <Card className="flex-1 bg-green-50 border-green-100">
            <Text className="text-green-700 font-bold text-xs uppercase mb-1">Aprobado</Text>
            <Text className="text-xl font-bold text-slate-800">${stats.approved.toLocaleString()}</Text>
          </Card>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
          {filters.map(f => (
            <TouchableOpacity 
              key={f}
              onPress={() => setFilter(f)}
              className={`px-4 py-2 rounded-full mr-2 border ${filter === f ? 'bg-primary border-primary' : 'bg-white border-slate-200'}`}
            >
              <Text className={filter === f ? 'text-white font-bold' : 'text-slate-600 font-medium'}>
                {f === 'ALL' ? 'Todos' : f.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1E40AF" className="mt-10" />
      ) : (
        <FlatList
          data={filteredQuotes}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16 }}
          onRefresh={fetchQuotes}
          refreshing={loading}
          renderItem={({ item }) => (
            <Card className="mb-4">
              <View className="flex-row justify-between items-start mb-3">
                <View>
                  <Text className="text-lg font-bold text-slate-800">{item.display_quote_number}</Text>
                  <Text className="text-slate-400 text-xs">#{item.id.slice(0,8)}</Text>
                </View>
                <StatusBadge status={item.status} />
              </View>
              
              <View className="bg-slate-50 p-3 rounded-xl mb-3">
                <Text className="text-slate-500 text-xs uppercase font-bold mb-1">Cliente</Text>
                <Text className="text-slate-800 font-medium">{item.client_name || 'Cargando...'}</Text>
              </View>

              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-slate-400 text-xs">Monto Total</Text>
                  <Text className="text-primary font-bold text-lg">${Number(item.total).toFixed(2)}</Text>
                </View>
                <Text className="text-slate-400 text-xs">{new Date(item.created_at).toLocaleDateString()}</Text>
              </View>
            </Card>
          )}
          ListEmptyComponent={
            <View className="items-center py-20">
              <Text className="text-slate-400 font-medium">No hay cotizaciones en este estado.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
