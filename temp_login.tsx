import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AirVentIcon, MailIcon } from '../../components/ui/Icons';

export default function Login() {
  const { login, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-ink"
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar barStyle="light-content" backgroundColor="#0D1B2A" />

      {/* Header hero */}
      <View className="bg-ink px-8 pt-16 pb-10 items-center">
        <View className="w-16 h-16 rounded-2xl bg-brand items-center justify-center mb-5" style={{ elevation: 8 }}>
          <AirVentIcon size={32} color="#FFFFFF" />
        </View>
        <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginBottom: 4 }}>
          CoolTrack Pro
        </Text>
        <Text style={{ color: '#4A6785', fontSize: 14, fontWeight: '500', letterSpacing: 0.5 }}>
          GESTIÃ“N PROFESIONAL HVAC
        </Text>
      </View>

      {/* Form card */}
      <View className="flex-1 bg-surface rounded-t-3xl px-6 pt-8 pb-10">
        <Text style={{ color: '#0D1B2A', fontSize: 22, fontWeight: '700', marginBottom: 24 }}>
          Iniciar sesiÃ³n
        </Text>

        <Input
          label="Correo electrÃ³nico"
          placeholder="usuario@empresa.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          leftIcon={<MailIcon size={16} color="#94a3b8" />}
        />

        <Input
          label="ContraseÃ±a"
          placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={() => router.push('/(auth)/forgot-password')}
          className="items-end mb-6 -mt-2"
        >
          <Text style={{ color: '#1B6CA8', fontWeight: '600', fontSize: 13 }}>
            Â¿Olvidaste tu contraseÃ±a?
          </Text>
        </TouchableOpacity>

        <Button
          title={loading ? 'Ingresando...' : 'Ingresar'}
          loading={loading}
          onPress={() => login(email, password)}
          size="lg"
          className="mb-4 w-full"
        />
      </View>
    </ScrollView>
  );
}

