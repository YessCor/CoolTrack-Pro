import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { apiCall } from '../../lib/api';
import { BarChartIcon, ClipboardIcon, AlertTriangleIcon, CheckCircleIcon, MapPinIcon } from '../../components/ui/Icons';

function StatCard({ label, value, icon, accent, sub }: { label: string; value: number | string; icon: React.ReactNode; accent: string; sub?: string }) {
  return (
    <View className="flex-1 bg-surface-card rounded-2xl p-4 border border-surface-border" style={{ minWidth: 0 }}>
      <View className="w-10 h-10 rounded-xl items-center justify-center mb-3" style={{ backgroundColor: accent + '18' }}>
        {icon}
      </View>
      <Text style={{ fontSize: 28, fontWeight: '800', color: '#0D1B2A', lineHeight: 32 }}>{value}</Text>
      <Text style={{ fontSize: 12, fontWeight: '600', color: '#64748b', marginTop: 2 }}>{label}</Text>
      {sub && <Text style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{sub}</Text>}
    </View>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ assigned: 0, completed: 0, alerts: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { success, data, error } = await apiCall<{ stats: any }>(`/api/admin/stats?user_id=${user.id}&role=${user.role}`);
      if (success && data) setStats(data.stats);
      else console.error('[ADMIN-DASH] error:', error);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStats(); }, []);

  return (
    <ScrollView
      className="flex-1 bg-surface"
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchStats} colors={['#0F4C75']} tintColor="#0F4C75" />}
    >
      {/* Welcome strip */}
      <View className="bg-ink rounded-2xl px-5 py-4 mb-5 flex-row items-center justify-between">
        <View>
          <Text style={{ color: '#4A6785', fontSize: 11, fontWeight: '700', letterSpacing: 1.2 }}>PANEL ADMINISTRATIVO</Text>
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginTop: 2 }}>Métricas del día</Text>
        </View>
        <View className="w-10 h-10 rounded-xl bg-brand items-center justify-center">
          <BarChartIcon size={20} color="#fff" />
        </View>
      </View>

      {/* KPI row */}
      <View className="flex-row gap-3 mb-3">
        <StatCard label="Asignadas" value={stats.assigned} icon={<ClipboardIcon size={20} color="#1B6CA8" />} accent="#1B6CA8" sub="Órdenes activas" />
        <StatCard label="Completadas" value={stats.completed} icon={<CheckCircleIcon size={20} color="#10B981" />} accent="#10B981" sub="Hoy" />
      </View>

      {/* Alerts */}
      <View className="bg-surface-card rounded-2xl p-4 border mb-5 flex-row items-center gap-4" style={{ borderColor: stats.alerts > 0 ? '#F59E0B40' : '#E2E8F0' }}>
        <View className="w-12 h-12 rounded-xl bg-amber-50 items-center justify-center">
          <AlertTriangleIcon size={22} color="#F59E0B" />
        </View>
        <View className="flex-1">
          <Text style={{ color: '#0D1B2A', fontSize: 22, fontWeight: '800' }}>{stats.alerts}</Text>
          <Text style={{ color: '#64748b', fontSize: 13, fontWeight: '600' }}>Alertas críticas</Text>
          <Text style={{ color: '#94a3b8', fontSize: 11, marginTop: 1 }}>Órdenes sin atención detectadas</Text>
        </View>
      </View>

      {/* Map */}
      <Text style={{ color: '#0D1B2A', fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Ubicación en tiempo real</Text>
      <View className="rounded-2xl overflow-hidden border border-surface-border" style={{ height: 200, backgroundColor: '#EEF2F7' }}>
        <View className="flex-1 items-center justify-center gap-3">
          <View className="w-14 h-14 rounded-2xl items-center justify-center" style={{ backgroundColor: '#E8F4FD' }}>
            <MapPinIcon size={26} color="#0F4C75" />
          </View>
          <Text style={{ color: '#64748b', fontWeight: '600', fontSize: 14 }}>Mapa en tiempo real</Text>
          <Text style={{ color: '#94a3b8', fontSize: 12 }}>Requiere Google Maps API Key</Text>
        </View>
      </View>
    </ScrollView>
  );
}
