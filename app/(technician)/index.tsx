import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { mockOrders } from '../../mocks/data';

export default function TechnicianHome() {
  const router = useRouter();

  const assignedOrders = mockOrders.filter(o => o.status !== 'COMPLETED');

  return (
    <View className="flex-1 bg-slate-50 p-4">
      <View className="h-40 bg-slate-200 rounded-2xl items-center justify-center mb-6 mt-2 shadow-sm">
        <Text className="text-slate-500 font-medium">🗺️ Mapa General (Ubicaciones)</Text>
      </View>

      <Text className="text-xl font-bold text-slate-800 mb-4">Servicios Incompletos</Text>

      <FlatList
        data={assignedOrders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/(technician)/job/${item.id}`)} className="mb-4">
            <Card>
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-lg font-bold text-slate-800 flex-1 mr-2">{item.title}</Text>
                <StatusBadge status={item.status} />
              </View>
              <Text className="text-slate-500 mb-1">📍 {item.address}</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
