import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AirVentIcon, MailIcon, PhoneIcon, UserIcon, GoogleIcon, ArrowLeftIcon } from '../../components/ui/Icons';

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert('Campos requeridos', 'Por favor completa todos los campos obligatorios.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert('¡Cuenta creada!', 'Ya puedes iniciar sesión.', [
          { text: 'Ir al login', onPress: () => router.replace('/(auth)/login') },
        ]);
      } else {
        Alert.alert('Error', data.error || 'No se pudo completar el registro.');
      }
    } catch {
      Alert.alert('Error de red', 'Verifica tu conexión e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-ink"
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar barStyle="light-content" backgroundColor="#0D1B2A" />

      {/* Header */}
      <View className="bg-ink px-6 pt-14 pb-8">
        <TouchableOpacity onPress={() => router.back()} className="mb-6" hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <ArrowLeftIcon size={24} color="#4A6785" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-3 mb-2">
          <AirVentIcon size={22} color="#00B4D8" />
          <Text style={{ color: '#00B4D8', fontWeight: '800', fontSize: 13, letterSpacing: 1.5 }}>COOLTRACK PRO</Text>
        </View>
        <Text style={{ color: '#FFFFFF', fontSize: 26, fontWeight: '800', letterSpacing: -0.5 }}>
          Crear cuenta
        </Text>
        <Text style={{ color: '#4A6785', fontSize: 14, marginTop: 4 }}>
          Únete como cliente y gestiona tus servicios
        </Text>
      </View>

      {/* Form */}
      <View className="flex-1 bg-surface rounded-t-3xl px-6 pt-8 pb-12">
        <Input
          label="Nombre completo *"
          placeholder="Ej. Juan Pérez"
          value={form.name}
          onChangeText={(v) => setForm({ ...form, name: v })}
          leftIcon={<UserIcon size={16} color="#94a3b8" />}
        />
        <Input
          label="Correo electrónico *"
          placeholder="tu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(v) => setForm({ ...form, email: v })}
          leftIcon={<MailIcon size={16} color="#94a3b8" />}
        />
        <Input
          label="Teléfono"
          placeholder="+57 300 000 0000"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(v) => setForm({ ...form, phone: v })}
          leftIcon={<PhoneIcon size={16} color="#94a3b8" />}
        />
        <Input
          label="Contraseña *"
          placeholder="Mínimo 8 caracteres"
          secureTextEntry
          value={form.password}
          onChangeText={(v) => setForm({ ...form, password: v })}
        />
        <Input
          label="Confirmar contraseña *"
          placeholder="Repite tu contraseña"
          secureTextEntry
          value={form.confirmPassword}
          onChangeText={(v) => setForm({ ...form, confirmPassword: v })}
        />

        <Button
          title={loading ? 'Creando cuenta...' : 'Crear cuenta'}
          loading={loading}
          onPress={handleRegister}
          size="lg"
          className="mt-2 mb-4 w-full"
        />

        <View className="flex-row items-center my-4">
          <View className="flex-1 h-px bg-surface-border" />
          <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '600', marginHorizontal: 12 }}>O</Text>
          <View className="flex-1 h-px bg-surface-border" />
        </View>

        <TouchableOpacity
          className="flex-row items-center justify-center bg-surface-card border border-surface-border py-3.5 rounded-xl"
          style={{ gap: 10 }}
        >
          <GoogleIcon size={20} />
          <Text style={{ color: '#0D1B2A', fontWeight: '600', fontSize: 15 }}>Registrarse con Google</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-8">
          <Text style={{ color: '#64748b', fontSize: 14 }}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: '#0F4C75', fontWeight: '700', fontSize: 14 }}>Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
