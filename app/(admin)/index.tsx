import { View, Text, ScrollView } from 'react-native';
import { Card } from '../../components/ui/Card';

export default function AdminDashboard() {
  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <Text className="text-2xl font-bold text-slate-800 mb-6 mt-2">Métricas del Día</Text>
      
      <View className="flex-row gap-4 mb-6">
        <Card className="flex-1 bg-primary border-0">
          <Text className="text-white/80 font-medium">Asignadas</Text>
          <Text className="text-3xl font-bold text-white mt-1">12</Text>
        </Card>
        <Card className="flex-1 bg-status-completed border-0">
          <Text className="text-white/80 font-medium">Completadas</Text>
          <Text className="text-3xl font-bold text-white mt-1">4</Text>
        </Card>
      </View>

      <Card className="mb-6 items-center py-6">
        <Text className="text-status-pending font-bold text-center mb-1">Alertas Activas</Text>
        <Text className="text-slate-600 text-center">3 Órdenes exceden tiempo estimado de ruta.</Text>
      </Card>

      <Text className="text-xl font-bold text-slate-800 mb-4">Técnicos Estacionarios Live</Text>
      <View className="h-48 bg-slate-200 rounded-2xl items-center justify-center shadow-sm">
        <Text className="text-slate-500 font-medium">🌐 Live Map Tracking (Placeholder)</Text>
      </View>
    </ScrollView>
  );
}
