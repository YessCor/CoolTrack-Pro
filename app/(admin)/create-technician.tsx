import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function CreateTechnician() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert('Error', 'Nombre, Email y Contraseña son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/technicians', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_id: user?.id,
          ...form,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('¡Éxito!', `Técnico ${data.technician.name} creado correctamente.`, [
          { text: 'Volver', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', data.error || 'No se pudo crear el técnico.');
      }
    } catch (error) {
      Alert.alert('Error', 'Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <Text className="text-2xl font-bold text-slate-800 mb-6 mt-4">Nuevo Técnico</Text>
      
      <View className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <Text className="text-slate-500 mb-4">Crea una cuenta para un nuevo miembro del staff.</Text>
        
        <Input 
          label="Nombre Completo" 
          placeholder="Ej. Pedro Picapiedra" 
          value={form.name}
          onChangeText={(val: string) => setForm({...form, name: val})}
        />
        <Input 
          label="Correo Electrónico" 
          placeholder="tech.pedro@cooltrack.com" 
          autoCapitalize="none"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(val: string) => setForm({...form, email: val})}
        />
        <Input 
          label="Teléfono" 
          placeholder="Ej. 1234567890" 
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(val: string) => setForm({...form, phone: val})}
        />
        <Input 
          label="Contraseña Temporal" 
          placeholder="••••••••" 
          secureTextEntry
          value={form.password}
          onChangeText={(val: string) => setForm({...form, password: val})}
        />

        <Button 
          title={loading ? "Creando..." : "Crear Técnico"} 
          onPress={handleCreate} 
          disabled={loading}
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
