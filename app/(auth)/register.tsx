import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert('Error', 'Por favor llena todos los campos obligatorios.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('¡Éxito!', 'Cuenta de cliente creada. Ahora puedes iniciar sesión.', [
          { text: 'Ir al Login', onPress: () => router.replace('/(auth)/login') }
        ]);
      } else {
        Alert.alert('Error', data.error || 'No se pudo completar el registro.');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-slate-50 p-6 pt-12">
      <View className="items-center mb-8">
        <Text className="text-3xl font-bold text-primary mb-2">Crear Cuenta</Text>
        <Text className="text-base text-secondary text-center">Únete a CoolTrack-Pro como Cliente</Text>
      </View>

      <View className="w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
        <Input 
          label="Nombre Completo *" 
          placeholder="Ej. Juan Pérez" 
          value={form.name}
          onChangeText={(val: string) => setForm({...form, name: val})}
        />
        <Input 
          label="Correo Electrónico *" 
          placeholder="ejemplo@correo.com" 
          keyboardType="email-address" 
          autoCapitalize="none"
          value={form.email}
          onChangeText={(val: string) => setForm({...form, email: val})}
        />
        <Input 
          label="Teléfono" 
          placeholder="Ej. +1 234 567 890" 
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(val: string) => setForm({...form, phone: val})}
        />
        <Input 
          label="Contraseña *" 
          placeholder="••••••••" 
          secureTextEntry
          value={form.password}
          onChangeText={(val: string) => setForm({...form, password: val})}
        />
        <Input 
          label="Confirmar Contraseña *" 
          placeholder="••••••••" 
          secureTextEntry
          value={form.confirmPassword}
          onChangeText={(val: string) => setForm({...form, confirmPassword: val})}
        />

        <Button 
          title={loading ? "Registrando..." : "Registrarse"} 
          className="mt-4 mb-4" 
          onPress={handleRegister}
          disabled={loading}
        />
        
        <TouchableOpacity className="flex-row items-center justify-center bg-white border border-slate-200 py-3 rounded-xl shadow-sm">
          <Text className="text-lg mr-2">Ⓜ️</Text>
          <Text className="text-slate-700 font-semibold text-lg">Regístrate con Google</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-center pb-12">
        <Text className="text-slate-600">¿Ya tienes cuenta? </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-primary font-bold">Inicia Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
