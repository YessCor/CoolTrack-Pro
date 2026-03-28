import { View, Text, ScrollView } from 'react-native';
import { Card } from '../../components/ui/Card';

export default function TechnicianProfile() {
  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <View className="items-center mt-6 mb-8">
        <View className="w-24 h-24 bg-slate-300 rounded-full mb-4 items-center justify-center">
          <Text className="text-3xl">👨‍🔧</Text>
        </View>
        <Text className="text-2xl font-bold text-slate-800">Juan Pérez</Text>
        <Text className="text-slate-500">Técnico Supervisor</Text>
      </View>

      <Text className="text-lg font-bold text-slate-800 mb-3">Documentación Legal</Text>
      
      <Card className="mb-3 flex-row justify-between items-center">
        <Text className="text-slate-800 font-medium">Licencia de Conducir</Text>
        <Text className="text-green-600 font-bold">Verificado ✓</Text>
      </Card>
      
      <Card className="mb-3 flex-row justify-between items-center">
        <Text className="text-slate-800 font-medium">Certificación HVAC A/C</Text>
        <Text className="text-green-600 font-bold">Verificado ✓</Text>
      </Card>

      <Card className="mb-6 flex-row justify-between items-center">
        <Text className="text-slate-800 font-medium">Seguro de Responsabilidad</Text>
        <Text className="text-yellow-600 font-bold">Pendiente</Text>
      </Card>
    </ScrollView>
  );
}
