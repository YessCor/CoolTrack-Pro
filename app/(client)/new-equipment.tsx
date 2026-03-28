import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function NewEquipment() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <Text className="text-2xl font-bold text-slate-800 mb-6 mt-4">Agregar Equipo HVAC</Text>
      
      <View className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <Input label="Tipo de Equipo" placeholder="Ej. Minisplit Inverter" />
        <Input label="Marca" placeholder="Ej. LG, Carrier, Mabe" />
        <Input label="Capacidad (BTUs)" placeholder="Ej. 12000" keyboardType="numeric" />
        <Input label="Ubicación en Propiedad" placeholder="Ej. Recámara principal" />

        <Button 
          title="Guardar Equipo" 
          onPress={() => router.back()} 
          className="mt-4"
        />
        <Button 
          title="Cancelar" 
          variant="outline" 
          onPress={() => router.back()} 
          className="mt-3"
        />
      </View>
    </ScrollView>
  );
}
