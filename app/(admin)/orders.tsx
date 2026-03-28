import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { mockOrders } from '../../mocks/data';

export default function AdminOrders() {
  return (
    <View className="flex-1 bg-slate-50 p-4">
      <Text className="text-2xl font-bold text-slate-800 mb-6 mt-2">Todas las Órdenes</Text>

      <FlatList
        data={mockOrders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity className="mb-4">
            <Card>
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-lg font-bold text-slate-800 flex-1 mr-2">#{item.id} - {item.title}</Text>
                <StatusBadge status={item.status} />
              </View>
              <Text className="text-slate-500 mb-1">📅 {item.date}</Text>
              <Text className="text-slate-600 font-medium">👨‍🔧 Técnico: {item.technician || 'Sin asignar'}</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
