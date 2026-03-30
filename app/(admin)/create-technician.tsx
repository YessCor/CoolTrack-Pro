import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { UserIcon, MailIcon, PhoneIcon, ShieldIcon } from '../../components/ui/Icons';

export default function CreateTechnician() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert('Campos requeridos', 'Nombre, email y contraseña son obligatorios.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/technicians', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_id: user?.id, ...form }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert('Técnico creado', `${data.technician.name} fue registrado correctamente.`, [
          { text: 'Volver', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('Error', data.error || 'No se pudo crear el técnico.');
      }
    } catch {
      Alert.alert('Error de red', 'Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
      <StatusBar barStyle="light-content" backgroundColor="#0D1B2A" />

      {/* Info banner */}
      <View className="bg-brand/10 rounded-2xl px-4 py-4 mb-6 flex-row items-center gap-3" style={{ backgroundColor: '#E8F4FD' }}>
        <ShieldIcon size={20} color="#0F4C75" />
        <Text style={{ color: '#0F4C75', fontSize: 13, fontWeight: '600', flex: 1, lineHeight: 18 }}>
          Estás creando una cuenta de técnico verificado para el equipo CoolTrack.
        </Text>
      </View>

      <View className="bg-surface-card rounded-2xl border border-surface-border p-5">
        <Input
          label="Nombre completo *"
          placeholder="Ej. Pedro Rodríguez"
          value={form.name}
          onChangeText={(v) => setForm({ ...form, name: v })}
          leftIcon={<UserIcon size={16} color="#94a3b8" />}
        />
        <Input
          label="Correo electrónico *"
          placeholder="tecnico@cooltrack.com"
          autoCapitalize="none"
          keyboardType="email-address"
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
          label="Contraseña temporal *"
          placeholder="Mínimo 8 caracteres"
          secureTextEntry
          value={form.password}
          onChangeText={(v) => setForm({ ...form, password: v })}
          hint="El técnico podrá cambiarla desde su perfil."
        />

        <Button
          title={loading ? 'Creando...' : 'Crear técnico'}
          loading={loading}
          onPress={handleCreate}
          size="lg"
          className="mt-4 mb-3 w-full"
        />
        <Button title="Cancelar" variant="outline" onPress={() => router.back()} className="w-full" />
      </View>
    </ScrollView>
  );
}
