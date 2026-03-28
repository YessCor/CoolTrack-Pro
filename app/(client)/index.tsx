import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { mockOrders } from '../../mocks/data';

export default function ClientHome() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-slate-50 p-4">
      <View className="flex-row justify-between items-center mb-6 mt-2">
        <Text className="text-2xl font-bold text-slate-800">Mis Solicitudes</Text>
        <TouchableOpacity 
          className="bg-primary px-4 py-2 rounded-lg shadow-sm"
          onPress={() => router.push('/(client)/new-request')}
        >
          <Text className="text-white font-semibold">+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockOrders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/(client)/service/${item.id}`)} className="mb-4">
            <Card>
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-lg font-bold text-slate-800 flex-1 mr-2">{item.title}</Text>
                <StatusBadge status={item.status} />
              </View>
              <Text className="text-slate-500 mb-1">📅 {item.date}</Text>
              {item.technician && <Text className="text-slate-600 font-medium">👨‍🔧 Técnico: {item.technician}</Text>}
            </Card>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
