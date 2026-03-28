import { View, Text, FlatList } from 'react-native';
import { Card } from '../../components/ui/Card';
import { mockClients } from '../../mocks/data';

export default function AdminClients() {
  return (
    <View className="flex-1 bg-slate-50 p-4">
      <Text className="text-2xl font-bold text-slate-800 mb-6 mt-2">Base de Clientes</Text>

      <FlatList
        data={mockClients}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card className="mb-4 flex-row justify-between items-center">
            <View>
              <Text className="text-lg font-bold text-slate-800 mb-1">{item.name}</Text>
              <Text className="text-slate-500 text-sm">ID: {item.id}</Text>
            </View>
            <View className="bg-primary-light/20 px-3 py-1 rounded-lg">
              <Text className="text-primary font-bold text-sm">Órdenes: {item.pendingOrders}</Text>
            </View>
          </Card>
        )}
      />
    </View>
  );
}
