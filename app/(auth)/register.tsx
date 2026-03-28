import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function Register() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-slate-50 p-6 pt-12">
      <View className="items-center mb-8">
        <Text className="text-3xl font-bold text-primary mb-2">Crear Cuenta</Text>
        <Text className="text-base text-secondary text-center">Únete a CoolTrack-Pro como Cliente</Text>
      </View>

      <View className="w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
        <Input label="Nombre Completo" placeholder="Ej. Juan Pérez" />
        <Input label="Correo Electrónico" placeholder="ejemplo@correo.com" keyboardType="email-address" autoCapitalize="none" />
        <Input label="Teléfono" placeholder="Ej. +1 234 567 890" keyboardType="phone-pad" />
        <Input label="Contraseña" placeholder="••••••••" secureTextEntry />
        <Input label="Confirmar Contraseña" placeholder="••••••••" secureTextEntry />

        <Button title="Registrarse" className="mt-4 mb-4" onPress={() => router.replace('/(auth)/login')} />
        
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
