import { View, Text, FlatList } from 'react-native';
import { Card } from '../../components/ui/Card';
import { mockEquipments } from '../../mocks/data';

export default function EquipmentScreen() {
  return (
    <View className="flex-1 bg-slate-50 p-4">
      <FlatList
        data={mockEquipments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card className="mb-4">
            <Text className="text-lg font-bold text-slate-800 mb-1">{item.name}</Text>
            <Text className="text-slate-600 mb-2">📍 {item.location}</Text>
            <View className="bg-slate-100 p-3 rounded-lg">
              <Text className="text-sm text-slate-500 font-medium">Último Mantenimiento:</Text>
              <Text className="text-base text-slate-800">{item.lastService}</Text>
            </View>
          </Card>
        )}
      />
    </View>
  );
}
