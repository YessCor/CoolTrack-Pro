import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { Card } from '../../components/ui/Card';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ assigned: 0, completed: 0, alerts: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Fetch admin stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <ScrollView 
      className="flex-1 bg-slate-50 p-4"
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchStats} colors={["#1E40AF"]} />
      }
    >
      <Text className="text-2xl font-bold text-slate-800 mb-6 mt-2">Métricas del Día</Text>
      
      <View className="flex-row gap-4 mb-6">
        <Card className="flex-1 bg-primary border-0 shadow-md">
          <Text className="text-white/80 font-medium">Asignadas</Text>
          <Text className="text-4xl font-bold text-white mt-1">{stats.assigned}</Text>
        </Card>
        <Card className="flex-1 bg-status-completed border-0 shadow-md">
          <Text className="text-white/80 font-medium">Completadas</Text>
          <Text className="text-4xl font-bold text-white mt-1">{stats.completed}</Text>
        </Card>
      </View>

      <Card className="mb-6 items-center py-6 border-slate-100 shadow-sm">
        <Text className="text-status-pending font-bold text-center mb-1 uppercase text-xs tracking-widest">Alertas Críticas</Text>
        <Text className="text-slate-800 text-3xl font-bold mb-1">{stats.alerts}</Text>
        <Text className="text-slate-500 text-center text-sm">Órdenes sin atención inmediata detectadas</Text>
      </Card>

      <Text className="text-xl font-bold text-slate-800 mb-4">Ubicación de Staff (Live)</Text>
      <View className="h-48 bg-slate-200 rounded-3xl items-center justify-center shadow-inner border border-slate-100">
        <Text className="text-slate-500 font-bold">🌐 Mapa en tiempo real (Mock)</Text>
        <Text className="text-slate-400 text-xs mt-1">Requiere Google Maps API Key</Text>
      </View>
      
      <View className="h-20" />
    </ScrollView>
  );
}
