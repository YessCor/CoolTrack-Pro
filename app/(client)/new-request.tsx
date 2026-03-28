import { View, Text, ScrollView } from 'react-native';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useRouter } from 'expo-router';

export default function NewRequestScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <Text className="text-2xl font-bold text-slate-800 mb-6 mt-4">Solicitar Servicio</Text>
      
      <View className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <Input label="Descripción del problema" placeholder="Ej. El aire no enfría..." />
        <Input label="Fecha Preferida" placeholder="DD/MM/YYYY" />
        <Input label="Hora Preferida" placeholder="Mañana o Tarde" />
        
        <View className="h-32 bg-slate-100 rounded-xl items-center justify-center border border-dashed border-slate-300 mt-2 mb-6">
          <Text className="text-slate-500 font-medium">📷 Subir fotos (Opcional)</Text>
        </View>

        <Button title="Enviar Solicitud" onPress={() => router.back()} />
        <Button title="Cancelar" variant="outline" className="mt-3" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}
