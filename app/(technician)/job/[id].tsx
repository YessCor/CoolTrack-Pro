import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Card } from '../../../components/ui/Card';
import { StatusBadge, OrderStatus } from '../../../components/ui/StatusBadge';
import { Button } from '../../../components/ui/Button';

export default function JobDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>('ASSIGNED');
  const [timer, setTimer] = useState('00:00:00');

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <View className="flex-row items-center mb-6 mt-2">
        <Text className="text-2xl font-bold text-slate-800 flex-1">Trabajo #{id}</Text>
        <StatusBadge status={status} />
      </View>

      <Card className="mb-6">
        <Text className="font-bold text-lg mb-2 text-slate-800">Ubicación y Tracking</Text>
        <Text className="text-slate-600 mb-3">📍 Av. Principal 123, Zona Centro</Text>
        <View className="h-32 bg-slate-200 rounded-xl items-center justify-center border border-slate-300 mb-3">
          <Text className="text-slate-500 font-medium">🗺️ Google Maps Placeholder</Text>
        </View>
        <Button title="Navegar (GPS Abierto)" variant="outline" />
      </Card>

      <Text className="text-xl font-bold text-slate-800 mb-3">Check-in de Estadía</Text>
      <Card className="mb-6 items-center py-6">
        <Text className="text-4xl font-bold text-slate-700 font-mono mb-4">{timer}</Text>
        <View className="flex-row gap-3 w-full">
          <Button title="Empezar" variant="secondary" className="flex-1" />
          <Button title="Pausar" variant="outline" className="flex-1" />
        </View>
      </Card>

      <Text className="text-xl font-bold text-slate-800 mb-3">Ejecución del Flujo</Text>
      <Card className="mb-6 flex-col gap-3">
        {status === 'ASSIGNED' && (
          <Button title="Aceptar Trabajo" onPress={() => setStatus('ACCEPTED')} />
        )}
        {status === 'ACCEPTED' && (
          <Button title="Reportar: Estoy en Camino" onPress={() => setStatus('ON_THE_WAY')} />
        )}
        {status === 'ON_THE_WAY' && (
          <Button title="Reportar: Llegué al Sitio" onPress={() => setStatus('ON_SITE')} />
        )}
        {status === 'ON_SITE' && (
          <Button title="Empezar Servicio Físico" onPress={() => setStatus('IN_PROGRESS')} />
        )}
        {status === 'IN_PROGRESS' && (
          <>
            <View className="bg-slate-50 p-3 rounded-lg border border-slate-200 min-h-[80px] mb-2">
              <Text className="text-slate-400">📝 Insertar Notas del trabajo...</Text>
            </View>
            <TouchableOpacity className="h-24 bg-slate-100 rounded-xl items-center justify-center border border-dashed border-slate-300 mb-2">
              <Text className="text-slate-500 font-medium">📷 Subir Evidencia Fotográfica</Text>
            </TouchableOpacity>
            <Button title="Crear Cotización Extra" variant="secondary" onPress={() => router.push('/(technician)/create-quote')} />
            <Button title="Completar y Cerrar Servicio" onPress={() => setStatus('COMPLETED')} className="mt-2" />
          </>
        )}
        {status === 'COMPLETED' && (
          <Text className="text-green-600 font-bold text-center py-4">Servicio Completado Exitosamente. Esperando validación de cliente.</Text>
        )}
      </Card>
    </ScrollView>
  );
}
