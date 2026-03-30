import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ArrowLeftIcon, AirVentIcon } from '../../components/ui/Icons';

const EQUIPMENT_TYPES = [
  { key: 'split', label: 'Aire de ventana' },
  { key: 'central', label: 'Sistema Central' },
  { key: 'mini_split', label: 'Minisplit' },
  { key: 'chiller', label: 'Chiller' },
  { key: 'fan_coil', label: 'Fan Coil' },
  { key: 'other', label: 'Otro' },
];

export default function NewEquipment() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams();
  
  const isEdit = params.mode === 'edit';
  const equipmentId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: (params.name as string) || '',
    type: (params.type as string) || 'mini_split',
    brand: (params.brand as string) || '',
    model: (params.model as string) || '',
    serial_number: (params.serial_number as string) || '',
    capacity_tons: (params.capacity_tons as string) || '',
    location_description: (params.location_description as string) || '',
    notes: (params.notes as string) || '',
  });

  const handleSubmit = async () => {
    if (!form.type || !form.location_description) {
      Alert.alert('Faltan datos', 'Por favor completa el tipo y la ubicación.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        client_id: user?.id,
        ...form,
        capacity_tons: form.capacity_tons ? parseFloat(form.capacity_tons) : null,
      };

      const url = isEdit ? `/api/equipment/${equipmentId}` : '/api/equipment';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (data.success) {
        Alert.alert(
          isEdit ? 'Actualizado' : 'Registrado',
          `Equipo ${isEdit ? 'actualizado' : 'registrado'} exitosamente.`,
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Error', data.error || `No se pudo ${isEdit ? 'actualizar' : 'registrar'} el equipo.`);
      }
    } catch {
      Alert.alert('Error de red', 'Verifica tu conexión e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-surface" 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View className="flex-row items-center gap-3 mb-6">
          <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-xl" style={{ backgroundColor: '#F1F5F9' }}>
            <ArrowLeftIcon size={20} color="#0F4C75" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-slate-800">
            {isEdit ? 'Editar Equipo' : 'Agregar Equipo'}
          </Text>
        </View>
        
        <View className="bg-surface-card rounded-2xl border border-surface-border p-5 mb-6">
          <Text className="text-sm font-semibold text-slate-500 mb-3">TIPO DE EQUIPO *</Text>
          <View className="flex-row flex-wrap gap-2 mb-5">
            {EQUIPMENT_TYPES.map(t => {
              const selected = form.type === t.key;
              return (
                <TouchableOpacity
                  key={t.key}
                  onPress={() => setForm({ ...form, type: t.key })}
                  className="flex-row items-center gap-2 px-4 py-2.5 rounded-xl border"
                  style={{
                    backgroundColor: selected ? '#0F4C75' : '#FFFFFF',
                    borderColor: selected ? '#0F4C75' : '#E2E8F0',
                  }}
                >
                  {selected && <AirVentIcon size={14} color="#fff" />}
                  <Text style={{ 
                    fontSize: 13, 
                    fontWeight: '600', 
                    color: selected ? '#fff' : '#64748b' 
                  }}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Input
            label="Nombre del equipo (opcional)"
            placeholder="Ej. AC Recámara Principal"
            value={form.name}
            onChangeText={(v) => setForm({ ...form, name: v })}
          />
          
          <Input
            label="Marca"
            placeholder="Ej. LG, Carrier, Mabe"
            value={form.brand}
            onChangeText={(v) => setForm({ ...form, brand: v })}
          />
          
          <Input
            label="Modelo"
            placeholder="Ej. artcool, 24HQTN"
            value={form.model}
            onChangeText={(v) => setForm({ ...form, model: v })}
          />
          
          <Input
            label="Número de serie"
            placeholder="Ej. SN-12345678"
            value={form.serial_number}
            onChangeText={(v) => setForm({ ...form, serial_number: v })}
          />
          
          <Input
            label="Capacidad (toneladas/BTUs)"
            placeholder="Ej. 2 o 24000"
            keyboardType="numeric"
            value={form.capacity_tons}
            onChangeText={(v) => setForm({ ...form, capacity_tons: v })}
          />
          
          <Input
            label="Ubicación en la propiedad *"
            placeholder="Ej. Recámara principal, Sala"
            value={form.location_description}
            onChangeText={(v) => setForm({ ...form, location_description: v })}
          />
          
          <Input
            label="Notas adicionales"
            placeholder="Ej. Tiene ruidos extraño"
            multiline
            numberOfLines={3}
            value={form.notes}
            onChangeText={(v) => setForm({ ...form, notes: v })}
          />
        </View>

        <Button 
          title={loading ? (isEdit ? 'Actualizando...' : 'Guardando...') : (isEdit ? 'Actualizar Equipo' : 'Guardar Equipo')} 
          onPress={handleSubmit} 
          loading={loading}
          className="mb-3"
        />
        <Button 
          title="Cancelar" 
          variant="outline" 
          onPress={() => router.back()} 
          disabled={loading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
