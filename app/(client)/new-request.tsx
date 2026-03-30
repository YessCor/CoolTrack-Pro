import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { uploadToCloudinary } from '../../services/cloudinary.service';
import { CameraIcon, MapPinIcon, AirVentIcon, CheckCircleIcon } from '../../components/ui/Icons';

const SERVICE_TYPES = [
  'Mantenimiento Correctivo',
  'Mantenimiento Preventivo',
  'Instalación',
  'Diagnóstico',
  'Recarga de Gas',
];

const PRIORITIES = [
  { key: 'low',    label: 'Baja',   color: '#10B981', bg: '#ECFDF5' },
  { key: 'medium', label: 'Media',  color: '#F59E0B', bg: '#FFFBEB' },
  { key: 'high',   label: 'Alta',   color: '#EF4444', bg: '#FEF2F2' },
];

export default function NewRequestScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [form, setForm] = useState({
    description: '',
    address: '',
    service_type: 'Mantenimiento Correctivo',
    priority: 'medium',
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.7 });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    if (!form.description || !form.address) {
      Alert.alert('Faltan datos', 'Por favor describe el problema e indica la dirección.');
      return;
    }
    setLoading(true);
    let finalImageUrl = null, publicId = null;
    try {
      if (imageUri) {
        setUploadingImage(true);
        const cloudData = await uploadToCloudinary(imageUri);
        if (cloudData) { finalImageUrl = cloudData.secure_url; publicId = cloudData.public_id; }
        setUploadingImage(false);
      }
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: user?.id, ...form }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert('Solicitud enviada', 'Un técnico será asignado pronto.', [
          { text: 'OK', onPress: () => router.replace('/(client)') },
        ]);
      } else {
        Alert.alert('Error', data.error || 'No se pudo crear la solicitud.');
      }
    } catch {
      Alert.alert('Error de red', 'Verifica tu conexión e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
      <StatusBar barStyle="light-content" backgroundColor="#0D1B2A" />

      {/* Service type selector */}
      <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b', letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase' }}>
        Tipo de servicio
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
        <View className="flex-row gap-2">
          {SERVICE_TYPES.map(type => {
            const active = form.service_type === type;
            return (
              <TouchableOpacity
                key={type}
                onPress={() => setForm({ ...form, service_type: type })}
                className="flex-row items-center gap-1.5 px-4 py-2.5 rounded-xl border"
                style={{
                  backgroundColor: active ? '#0F4C75' : '#FFFFFF',
                  borderColor: active ? '#0F4C75' : '#E2E8F0',
                }}
              >
                {active && <CheckCircleIcon size={14} color="#fff" />}
                <Text style={{ fontSize: 13, fontWeight: '600', color: active ? '#fff' : '#64748b' }}>
                  {type}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Main form */}
      <View className="bg-surface-card rounded-2xl border border-surface-border p-5 gap-0">
        <Input
          label="Describe el problema *"
          placeholder="Ej. El equipo no enciende, hace ruido extraño..."
          multiline
          numberOfLines={3}
          value={form.description}
          onChangeText={(v) => setForm({ ...form, description: v })}
        />
        <Input
          label="Dirección del servicio *"
          placeholder="Calle 123 #45-67, Barranquilla"
          value={form.address}
          onChangeText={(v) => setForm({ ...form, address: v })}
          leftIcon={<MapPinIcon size={16} color="#94a3b8" />}
        />
      </View>

      {/* Priority */}
      <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b', letterSpacing: 1, marginTop: 20, marginBottom: 10, textTransform: 'uppercase' }}>
        Prioridad
      </Text>
      <View className="flex-row gap-3 mb-6">
        {PRIORITIES.map(p => {
          const active = form.priority === p.key;
          return (
            <TouchableOpacity
              key={p.key}
              onPress={() => setForm({ ...form, priority: p.key })}
              className="flex-1 items-center py-3 rounded-xl border"
              style={{
                backgroundColor: active ? p.bg : '#FFFFFF',
                borderColor: active ? p.color : '#E2E8F0',
              }}
            >
              <View className="w-2.5 h-2.5 rounded-full mb-1.5" style={{ backgroundColor: p.color }} />
              <Text style={{ fontSize: 12, fontWeight: '700', color: active ? p.color : '#94a3b8' }}>
                {p.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Image picker */}
      <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b', letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase' }}>
        Evidencia fotográfica (opcional)
      </Text>
      <TouchableOpacity
        onPress={pickImage}
        className="rounded-2xl border border-dashed border-surface-border overflow-hidden mb-6"
        style={{ height: 140, backgroundColor: '#F5F7FA' }}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        ) : (
          <View className="flex-1 items-center justify-center gap-2">
            <View className="w-12 h-12 rounded-xl bg-surface-hover items-center justify-center">
              <CameraIcon size={22} color="#94a3b8" />
            </View>
            <Text style={{ color: '#94a3b8', fontWeight: '600', fontSize: 13 }}>Tocar para adjuntar foto</Text>
          </View>
        )}
        {uploadingImage && (
          <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color="#fff" />
          </View>
        )}
      </TouchableOpacity>

      <Button
        title={loading ? 'Enviando solicitud...' : 'Enviar solicitud'}
        loading={loading}
        onPress={handleSubmit}
        size="lg"
        className="mb-3 w-full"
      />
      <Button title="Cancelar" variant="outline" onPress={() => router.back()} disabled={loading} className="w-full" />
    </ScrollView>
  );
}
