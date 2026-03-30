import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ArrowLeftIcon, MailIcon, AirVentIcon } from '../../components/ui/Icons';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!email) { Alert.alert('Campo requerido', 'Ingresa tu correo electrónico.'); return; }
    setSent(true);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-ink" keyboardShouldPersistTaps="handled">
      <StatusBar barStyle="light-content" backgroundColor="#0D1B2A" />

      <View className="bg-ink px-6 pt-14 pb-8">
        <TouchableOpacity onPress={() => router.back()} className="mb-6" hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <ArrowLeftIcon size={24} color="#4A6785" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-3 mb-2">
          <AirVentIcon size={22} color="#00B4D8" />
          <Text style={{ color: '#00B4D8', fontWeight: '800', fontSize: 13, letterSpacing: 1.5 }}>COOLTRACK PRO</Text>
        </View>
        <Text style={{ color: '#FFFFFF', fontSize: 26, fontWeight: '800' }}>Recuperar contraseña</Text>
        <Text style={{ color: '#4A6785', fontSize: 14, marginTop: 4 }}>
          Te enviaremos un enlace a tu correo registrado.
        </Text>
      </View>

      <View className="flex-1 bg-surface rounded-t-3xl px-6 pt-8 pb-12">
        {sent ? (
          <View className="items-center py-12">
            <View className="w-20 h-20 rounded-full bg-emerald-50 items-center justify-center mb-6">
              <MailIcon size={36} color="#10B981" />
            </View>
            <Text style={{ color: '#0D1B2A', fontSize: 20, fontWeight: '700', marginBottom: 8, textAlign: 'center' }}>
              Correo enviado
            </Text>
            <Text style={{ color: '#64748b', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 32 }}>
              Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
            </Text>
            <Button title="Volver al inicio" onPress={() => router.replace('/(auth)/login')} className="w-full" />
          </View>
        ) : (
          <>
            <Input
              label="Correo electrónico"
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              leftIcon={<MailIcon size={16} color="#94a3b8" />}
            />
            <Button title="Enviar enlace" onPress={handleSend} size="lg" className="mt-2 w-full" />
            <TouchableOpacity onPress={() => router.back()} className="items-center mt-6">
              <Text style={{ color: '#0F4C75', fontWeight: '600', fontSize: 14 }}>Volver al inicio de sesión</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}
