import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { BarChartIcon, ClipboardIcon, AlertTriangleIcon, CheckCircleIcon, MapPinIcon, UsersIcon, WrenchIcon, FileTextIcon } from '../../components/ui/Icons';
import { calculateKPIs, KPIData, TimeRange, formatCurrency } from '../../lib/services/kpi-service';
import { SyncStatus } from '../../components/SyncStatus';

function StatCard({ label, value, icon, accent, sub }: { label: string; value: number | string; icon: React.ReactNode; accent: string; sub?: string }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: accent + '18' }]}>
        {icon}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {sub && <Text style={styles.statSub}>{sub}</Text>}
    </View>
  );
}

function TimeRangeSelector({ selected, onSelect }: { selected: TimeRange; onSelect: (range: TimeRange) => void }) {
  const ranges: TimeRange[] = ['today', 'week', 'month', 'year'];
  const labels = { today: 'Hoy', week: 'Semana', month: 'Mes', year: 'Año' };
  const colors = { today: '#0F4C75', week: '#1B6CA8', month: '#2E86AB', year: '#00B4D8' };

  return (
    <View style={styles.rangeSelector}>
      {ranges.map(range => (
        <TouchableOpacity
          key={range}
          style={[
            styles.rangeButton,
            selected === range && { backgroundColor: colors[range] }
          ]}
          onPress={() => onSelect(range)}
        >
          <Text style={[
            styles.rangeButtonText,
            selected === range && { color: '#fff' }
          ]}>
            {labels[range]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  const fetchStats = useCallback(async () => {
    try {
      const data = await calculateKPIs(timeRange);
      setStats(data);
    } catch (error) {
      console.error('Error fetching KPIs:', error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={fetchStats}
          colors={['#0F4C75']}
          tintColor="#0F4C75"
        />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.welcomeLabel}>PANEL ADMINISTRATIVO</Text>
          <Text style={styles.welcomeTitle}>Bienvenido{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</Text>
        </View>
        <SyncStatus />
      </View>

      <TimeRangeSelector selected={timeRange} onSelect={setTimeRange} />

      <View style={styles.welcomeStrip}>
        <View>
          <Text style={styles.welcomeSubLabel}>MÉTRICAS</Text>
          <Text style={styles.welcomeSubTitle}>Resumen de rendimiento</Text>
        </View>
        <View style={styles.welcomeIcon}>
          <BarChartIcon size={24} color="#fff" />
        </View>
      </View>

      {stats ? (
        <>
          <View style={styles.statsGrid}>
            <StatCard
              label="Completados"
              value={stats.servicesCompleted}
              icon={<CheckCircleIcon size={22} color="#10B981" />}
              accent="#10B981"
              sub={`${stats.preventiveCount} preventivos, ${stats.correctiveCount} correctivos`}
            />
            <StatCard
              label="Activos"
              value={stats.inProgressOrders}
              icon={<WrenchIcon size={22} color="#F59E0B" />}
              accent="#F59E0B"
              sub="En progreso"
            />
          </View>

          <View style={styles.statsGrid}>
            <StatCard
              label="Pendientes"
              value={stats.pendingOrders}
              icon={<ClipboardIcon size={22} color="#1B6CA8" />}
              accent="#1B6CA8"
              sub="Sin asignar"
            />
            <StatCard
              label="Técnicos activos"
              value={stats.activeTechnicians}
              icon={<UsersIcon size={22} color="#7C3AED" />}
              accent="#7C3AED"
              sub="En servicio"
            />
          </View>

          <View style={styles.statsGrid}>
            <StatCard
              label="Ingresos"
              value={formatCurrency(stats.totalRevenue)}
              icon={<FileTextIcon size={22} color="#0F4C75" />}
              accent="#0F4C75"
              sub="Cotizaciones aprobadas"
            />
            <View style={[styles.statCard, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]}>
              <View style={[styles.statIcon, { backgroundColor: '#FDE68A' }]}>
                <AlertTriangleIcon size={22} color="#F59E0B" />
              </View>
              <Text style={styles.statValue}>{(stats.pendingOrders + stats.inProgressOrders)}</Text>
              <Text style={styles.statLabel}>Órdenes activas</Text>
              <Text style={styles.statSub}>Requieren atención</Text>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.loadingStats}>
          <Text style={styles.loadingText}>Cargando métricas...</Text>
        </View>
      )}

      <View style={styles.mapSection}>
        <Text style={styles.sectionTitle}>Ubicación en tiempo real</Text>
        <View style={styles.mapPlaceholder}>
          <View style={styles.mapContent}>
            <View style={styles.mapIcon}>
              <MapPinIcon size={32} color="#0F4C75" />
            </View>
            <Text style={styles.mapTitle}>Mapa de técnicos</Text>
            <Text style={styles.mapSubtitle}>Seguimiento GPS en tiempo real</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  welcomeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1.2,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0D1B2A',
    marginTop: 2,
  },
  welcomeStrip: {
    backgroundColor: '#0D1B2A',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeSubLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4A6785',
    letterSpacing: 1.2,
  },
  welcomeSubTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  welcomeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1B6CA8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rangeSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rangeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  rangeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0D1B2A',
    lineHeight: 30,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 2,
    textAlign: 'center',
  },
  statSub: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
  },
  loadingStats: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  mapSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D1B2A',
    marginBottom: 12,
  },
  mapPlaceholder: {
    backgroundColor: '#EEF2F7',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mapContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  mapIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#E8F4FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D1B2A',
  },
  mapSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
});
