import { View, Text, ScrollView } from 'react-native';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useRouter } from 'expo-router';

export default function CreateQuote() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <Text className="text-2xl font-bold text-slate-800 mb-6 mt-4">Generar Cotización</Text>
      
      <View className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <Input label="Concepto / Refacción" placeholder="Ej. Gas Refrigerante R410A" />
        <Input label="Costo ($)" placeholder="250.00" keyboardType="numeric" />
        
        <Button title="Añadir a lista" variant="secondary" className="mb-6" />

        <Text className="text-lg font-bold text-slate-800 mb-3">Resumen de Cuenta</Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-slate-600">Revisión Carga de Gas</Text>
          <Text className="font-medium">$850.00</Text>
        </View>
        <View className="flex-row justify-between mb-4">
          <Text className="text-slate-600">Mano de Obra</Text>
          <Text className="font-medium">$400.00</Text>
        </View>
        <View className="flex-row justify-between border-t border-slate-200 pt-3 mb-5">
          <Text className="font-bold text-lg">Total estimado</Text>
          <Text className="font-bold text-lg text-primary">$1,250.00</Text>
        </View>

        <Button title="Enviar Cotización al Cliente" onPress={() => router.back()} />
        <Button title="Cancelar" variant="outline" className="mt-3" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}
