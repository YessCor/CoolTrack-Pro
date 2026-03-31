import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, StatusBar, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { UserIcon, MailIcon, PhoneIcon, MapPinIcon, ShieldIcon, ArrowLeftIcon } from '../../../components/ui/Icons';
import { Toast } from '../../../components/ui/Toast';

export default function NewClientScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
  });

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) {
      setToast({
        visible: true,
        message: 'Nombre, email y contraseña son requeridos.',
        type: 'error',
      });
      return;
    }

    if (form.password.length < 6) {
      setToast({
        visible: true,
        message: 'La contraseña debe tener al menos 6 caracteres.',
        type: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/clients?admin_id=${user?.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        setToast({
          visible: true,
          message: `Cliente ${data.client.name} registrado correctamente.`,
          type: 'success',
        });
        setTimeout(() => router.back(), 1500);
      } else {
        setToast({
          visible: true,
          message: data.error || 'No se pudo crear el cliente.',
          type: 'error',
        });
      }
    } catch {
      setToast({
        visible: true,
        message: 'Error de red. Verifica tu conexión.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
      <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <StatusBar barStyle="light-content" backgroundColor="#0D1B2A" />

        <View className="flex-row items-center gap-3 mb-6">
          <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-xl" style={{ backgroundColor: '#F1F5F9' }}>
            <ArrowLeftIcon size={20} color="#0F4C75" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-slate-800">Nuevo Cliente</Text>
        </View>

        <View className="bg-surface-card rounded-2xl border border-surface-border p-5 mb-6">
          <Input
            label="Nombre completo *"
            placeholder="Ej. Juan Pérez"
            value={form.name}
            onChangeText={(v) => setForm({ ...form, name: v })}
            leftIcon={<UserIcon size={16} color="#94a3b8" />}
          />
          <Input
            label="Correo electrónico *"
            placeholder="cliente@email.com"
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
            label="Dirección"
            placeholder="Calle 123 #45-67, Barranquilla"
            value={form.address}
            onChangeText={(v) => setForm({ ...form, address: v })}
            leftIcon={<MapPinIcon size={16} color="#94a3b8" />}
          />
          <Input
            label="Contraseña *"
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            value={form.password}
            onChangeText={(v) => setForm({ ...form, password: v })}
            hint="El cliente podrá cambiarla desde su perfil."
          />

          <Button
            title={loading ? 'Creando...' : 'Crear cliente'}
            loading={loading}
            onPress={handleCreate}
            size="lg"
            className="mt-4 mb-3 w-full"
          />
          <Button title="Cancelar" variant="outline" onPress={() => router.back()} className="w-full" />
        </View>
      </ScrollView>
    </>
  );
}
