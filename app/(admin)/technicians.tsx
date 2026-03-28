import { View, Text, FlatList } from 'react-native';
import { Card } from '../../components/ui/Card';
import { mockTechnicians } from '../../mocks/data';

export default function AdminTechnicians() {
  return (
    <View className="flex-1 bg-slate-50 p-4">
      <Text className="text-2xl font-bold text-slate-800 mb-6 mt-2">Directorio de Técnicos</Text>

      <FlatList
        data={mockTechnicians}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card className="mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-bold text-slate-800">{item.name}</Text>
              <Text className={`font-bold ${item.status === 'Online' ? 'text-green-600' : 'text-slate-400'}`}>
                {item.status}
              </Text>
            </View>
            <Text className="text-slate-600 font-medium">📍 Trabajos activos: {item.activeJobs}</Text>
          </Card>
        )}
      />
    </View>
  );
}
