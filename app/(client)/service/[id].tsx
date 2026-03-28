import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Card } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Button } from '../../../components/ui/Button';

export default function ServiceDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <View className="flex-row items-center mb-6 mt-2">
        <Text className="text-2xl font-bold text-slate-800 flex-1">Orden #{id}</Text>
        <StatusBadge status="IN_PROGRESS" />
      </View>

      <Card className="mb-6">
        <Text className="font-bold text-lg mb-2 text-slate-800">Ubicación del Técnico</Text>
        <View className="h-40 bg-slate-200 rounded-xl items-center justify-center mb-3">
          <Text className="text-slate-500 font-medium">🗺️ [Mapa Placeholder]</Text>
        </View>
        <Text className="text-slate-600 font-medium">👨‍🔧 Técnico: Juan Pérez</Text>
      </Card>

      <Text className="text-xl font-bold text-slate-800 mb-3">Cotización Propuesta</Text>
      <Card className="mb-6 bg-blue-50 border-blue-100">
        <View className="flex-row justify-between mb-2">
          <Text className="text-slate-600">Revisión Carga de Gas</Text>
          <Text className="font-medium">$850.00</Text>
        </View>
        <View className="flex-row justify-between mb-4">
          <Text className="text-slate-600">Mano de Obra</Text>
          <Text className="font-medium">$400.00</Text>
        </View>
        <View className="flex-row justify-between border-t border-blue-200 pt-3 mb-5">
          <Text className="font-bold text-lg">Total</Text>
          <Text className="font-bold text-lg text-primary">$1,250.00</Text>
        </View>

        <View className="flex-row gap-3">
          <Button title="Aprobar" className="flex-1" onPress={() => router.back()} />
          <Button title="Rechazar" variant="danger" className="flex-1" onPress={() => router.back()} />
        </View>
      </Card>
    </ScrollView>
  );
}
