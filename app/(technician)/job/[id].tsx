import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Card } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Button } from '../../../components/ui/Button';

export default function JobDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <View className="flex-row items-center mb-6 mt-2">
        <Text className="text-2xl font-bold text-slate-800 flex-1">Trabajo #{id}</Text>
        <StatusBadge status="ASSIGNED" />
      </View>

      <Card className="mb-6">
        <Text className="font-bold text-lg mb-2 text-slate-800">Dirección Mapeada</Text>
        <Text className="text-slate-600 mb-3">📍 Av. Principal 123, Zona Centro</Text>
        <Button title="Navegar (GPS)" variant="outline" />
      </Card>

      <Text className="text-xl font-bold text-slate-800 mb-3">Acciones Requeridas</Text>
      <Card className="mb-6 flex-col gap-3">
        <Button title="Marcar En Progreso" />
        <Button title="Crear Cotización" variant="secondary" onPress={() => router.push('/(technician)/create-quote')} />
        
        <View className="h-24 bg-slate-100 rounded-xl items-center justify-center border border-dashed border-slate-300 mt-2">
          <Text className="text-slate-500 font-medium">📷 Evidencia Fotográfica (UI)</Text>
        </View>

        <Button title="Completar Servicio" className="bg-status-completed mt-2" />
      </Card>
    </ScrollView>
  );
}
