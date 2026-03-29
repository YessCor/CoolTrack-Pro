import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth, Role } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function Login() {
  const { login, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRealLogin = () => {
    login(email, password);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-slate-50 p-6 pt-12">
      <View className="items-center mb-8 mt-4">
        <Text className="text-4xl font-bold text-primary mb-2">CoolTrack-Pro</Text>
        <Text className="text-base text-secondary text-center">Gestión Profesional HVAC</Text>
      </View>

      <View className="w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-8">
        <Text className="text-xl font-bold text-slate-800 mb-6">Iniciar Sesión</Text>
        
        <Input 
          label="Correo Electrónico" 
          placeholder="ejemplo@correo.com" 
          keyboardType="email-address" 
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        
        <Input 
          label="Contraseña" 
          placeholder="••••••••" 
          secureTextEntry 
          value={password}
          onChangeText={setPassword}
        />

        <View className="items-end mb-6">
          <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
            <Text className="text-primary font-medium">¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>

        <Button 
          title={loading ? "Entrando..." : "Entrar"} 
          onPress={handleRealLogin} 
          disabled={loading}
          className="mb-3"
        />

        <View className="flex-row items-center my-6">
          <View className="flex-1 h-[1px] bg-slate-200" />
          <Text className="mx-4 text-slate-400 font-medium">O</Text>
          <View className="flex-1 h-[1px] bg-slate-200" />
        </View>

        <TouchableOpacity className="flex-row items-center justify-center bg-white border border-slate-200 py-3 rounded-xl shadow-sm mb-4">
          <Text className="text-lg mr-2">Ⓜ️ </Text>
          <Text className="text-slate-700 font-semibold text-lg">Continuar con Google</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-center pb-8">
        <Text className="text-slate-600">¿No tienes una cuenta? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text className="text-primary font-bold">Regístrate</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
