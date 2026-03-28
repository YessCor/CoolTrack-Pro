import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function ForgotPassword() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-slate-50 p-6 pt-16">
      <View className="items-center mb-8 pb-4">
        <Text className="text-3xl font-bold text-slate-800 mb-4 text-center">Recuperar Contraseña</Text>
        <Text className="text-base text-slate-500 text-center px-4">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
      </View>

      <View className="w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
        <Input label="Correo Electrónico" placeholder="ejemplo@correo.com" keyboardType="email-address" autoCapitalize="none" />

        <Button title="Enviar Enlace de Recuperación" className="mt-2 mb-4" onPress={() => router.back()} />
      </View>

      <View className="flex-row justify-center pb-8">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-primary font-bold">Volver al Inicio de Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
