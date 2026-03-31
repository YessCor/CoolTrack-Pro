import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator, Image, TouchableOpacity, StatusBar, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { uploadToCloudinary } from '../../services/cloudinary.service';
import { CameraIcon, MapPinIcon, AirVentIcon, CheckCircleIcon, ChevronDownIcon, XIcon } from '../../components/ui/Icons';
import { Toast } from '../../components/ui/Toast';

const SERVICE_TYPES = [
  'Mantenimiento Correctivo',
  'Mantenimiento Preventivo',
  'Instalación',
  'Diagnóstico',
  'Recarga de Gas',
];

const EQUIPMENT_TYPES: Record<string, string> = {
  split: 'Aire de ventana',
  central: 'Sistema Central',
  mini_split: 'Minisplit',
  chiller: 'Chiller',
  fan_coil: 'Fan Coil',
  other: 'Otro',
};

const PRIORITIES = [
  { key: 'low',    label: 'Baja',   color: '#10B981', bg: '#ECFDF5' },
  { key: 'medium', label: 'Media',  color: '#F59E0B', bg: '#FFFBEB' },
  { key: 'high',   label: 'Alta',   color: '#EF4444', bg: '#FEF2F2' },
];

export default function NewRequestScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [equipments, setEquipments] = useState<any[]>([]);
  const [showEquipmentPicker, setShowEquipmentPicker] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [form, setForm] = useState({
    description: '',
    address: '',
    service_type: 'Mantenimiento Correctivo',
    priority: 'medium',
  });

  useEffect(() => {
    const fetchEquipments = async () => {
      if (!user?.id || user.id === 'mock') return;
      try {
        const res = await fetch(`/api/equipment?client_id=${user.id}`);
        const data = await res.json();
        if (data.success) setEquipments(data.equipments);
      } catch (e) { console.error(e); }
    };
    fetchEquipments();
  }, [user?.id]);

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
        body: JSON.stringify({ 
          client_id: user?.id, 
          equipment_id: selectedEquipment?.id || null,
          ...form 
        }),
      });
      const data = await res.json();
      if (data.success) {
        setToast({
          visible: true,
          message: 'Solicitud enviada exitosamente. Un técnico será asignado pronto.',
          type: 'success',
        });
        setTimeout(() => router.replace('/(client)'), 1500);
      } else {
        setToast({
          visible: true,
          message: data.error || 'No se pudo crear la solicitud.',
          type: 'error',
        });
      }
    } catch {
      Alert.alert('Error de red', 'Verifica tu conexión e intenta de nuevo.');
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

      {/* Equipment selector */}
      <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b', letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase' }}>
        Equipo a reparar
      </Text>
      <TouchableOpacity
        onPress={() => setShowEquipmentPicker(true)}
        className="rounded-xl border border-surface-border overflow-hidden mb-5"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <View className="px-4 py-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3 flex-1">
            {selectedEquipment ? (
              <>
                <View className="w-9 h-9 rounded-lg bg-brand/10 items-center justify-center">
                  <AirVentIcon size={16} color="#0F4C75" />
                </View>
                <View className="flex-1">
                  <Text style={{ fontWeight: '600', color: '#0D1B2A', fontSize: 14 }}>
                    {selectedEquipment.name || EQUIPMENT_TYPES[selectedEquipment.type] || selectedEquipment.type}
                  </Text>
                  <Text style={{ color: '#64748b', fontSize: 12 }}>
                    {selectedEquipment.brand} {selectedEquipment.model ? `· ${selectedEquipment.model}` : ''}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View className="w-9 h-9 rounded-lg bg-surface-hover items-center justify-center">
                  <AirVentIcon size={16} color="#94a3b8" />
                </View>
                <Text style={{ color: '#94a3b8', fontSize: 14 }}>Seleccionar equipo (opcional)</Text>
              </>
            )}
          </View>
          <ChevronDownIcon size={18} color="#94a3b8" />
        </View>
      </TouchableOpacity>

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

    {/* Equipment Picker Modal */}
    <Modal visible={showEquipmentPicker} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl" style={{ maxHeight: '70%' }}>
          <View className="px-5 py-4 border-b border-surface-border flex-row items-center justify-between">
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#0D1B2A' }}>Seleccionar Equipo</Text>
            <TouchableOpacity onPress={() => setShowEquipmentPicker(false)} className="p-2">
              <XIcon size={20} color="#64748b" />
            </TouchableOpacity>
          </View>
          <ScrollView className="p-4" contentContainerStyle={{ gap: 10 }}>
            <TouchableOpacity
              onPress={() => {
                setSelectedEquipment(null);
                setShowEquipmentPicker(false);
              }}
              className="flex-row items-center gap-3 p-4 rounded-xl border"
              style={{ 
                borderColor: selectedEquipment === null ? '#0F4C75' : '#E2E8F0',
                backgroundColor: selectedEquipment === null ? '#E8F4FD' : '#FFFFFF'
              }}
            >
              <View className="w-10 h-10 rounded-lg bg-surface-hover items-center justify-center">
                <AirVentIcon size={18} color="#94a3b8" />
              </View>
              <View className="flex-1">
                <Text style={{ fontWeight: '600', color: '#0D1B2A', fontSize: 14 }}>Otro equipo</Text>
                <Text style={{ color: '#64748b', fontSize: 12 }}>No appears in my list</Text>
              </View>
              {selectedEquipment === null && <CheckCircleIcon size={18} color="#0F4C75" />}
            </TouchableOpacity>

            {equipments.map((eq) => {
              const isSelected = selectedEquipment?.id === eq.id;
              return (
                <TouchableOpacity
                  key={eq.id}
                  onPress={() => {
                    setSelectedEquipment(eq);
                    setShowEquipmentPicker(false);
                  }}
                  className="flex-row items-center gap-3 p-4 rounded-xl border"
                  style={{ 
                    borderColor: isSelected ? '#0F4C75' : '#E2E8F0',
                    backgroundColor: isSelected ? '#E8F4FD' : '#FFFFFF'
                  }}
                >
                  <View className="w-10 h-10 rounded-lg bg-brand/10 items-center justify-center">
                    <AirVentIcon size={18} color="#0F4C75" />
                  </View>
                  <View className="flex-1">
                    <Text style={{ fontWeight: '600', color: '#0D1B2A', fontSize: 14 }}>
                      {eq.name || EQUIPMENT_TYPES[eq.type] || eq.type}
                    </Text>
                    <Text style={{ color: '#64748b', fontSize: 12 }}>
                      {eq.brand || 'N/A'} {eq.model ? `· ${eq.model}` : ''} · {eq.location_description}
                    </Text>
                  </View>
                  {isSelected && <CheckCircleIcon size={18} color="#0F4C75" />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
    </>
  );
}
