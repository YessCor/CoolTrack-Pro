import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();

  return (
    <View className="flex-1 items-center justify-center p-6 bg-slate-50">
      <View className="items-center mb-10">
        <Text className="text-4xl font-bold text-primary mb-2">CoolTrack-Pro</Text>
        <Text className="text-base text-secondary text-center">Selecciona un rol para simular el inicio de sesión estructurado</Text>
      </View>

      <View className="w-full max-w-sm gap-4">
        <TouchableOpacity 
          className="bg-primary py-4 rounded-xl items-center shadow-sm"
          onPress={() => login('CLIENT')}
        >
          <Text className="text-white font-semibold text-lg">Entrar como Cliente</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-primary-light py-4 rounded-xl items-center shadow-sm"
          onPress={() => login('TECHNICIAN')}
        >
          <Text className="text-white font-semibold text-lg">Entrar como Técnico</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-slate-800 py-4 rounded-xl items-center shadow-sm"
          onPress={() => login('ADMIN')}
        >
          <Text className="text-white font-semibold text-lg">Panel Administrador</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
