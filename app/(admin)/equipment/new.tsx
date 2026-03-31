import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeftIcon, AirVentIcon, UserIcon, ChevronDownIcon } from '../../../components/ui/Icons';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Toast } from '../../../components/ui/Toast';
import { useAuth } from '../../../context/AuthContext';

const EQUIPMENT_TYPES = [
  { key: 'split', label: 'Aire de ventana' },
  { key: 'window', label: 'Ventana' },
  { key: 'central', label: 'Sistema Central' },
  { key: 'mini_split', label: 'Minisplit' },
  { key: 'chiller', label: 'Chiller' },
  { key: 'fan_coil', label: 'Fan Coil' },
  { key: 'package', label: 'Paquete' },
  { key: 'other', label: 'Otro' },
];

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export default function AdminNewEquipment() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams();

  const isEdit = params.mode === 'edit';
  const equipmentId = params.id as string;
  const prefilledClientId = params.client_id as string;

  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [showClientPicker, setShowClientPicker] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });

  const [form, setForm] = useState({
    client_id: prefilledClientId || '',
    client_name: '',
    name: (params.name as string) || '',
    type: (params.type as string) || 'mini_split',
    brand: (params.brand as string) || '',
    model: (params.model as string) || '',
    serial_number: (params.serial_number as string) || '',
    capacity_tons: (params.capacity_tons as string) || '',
    location_description: (params.location_description as string) || '',
    notes: (params.notes as string) || '',
  });

  useEffect(() => {
    const init = async () => {
      await loadClients();
      if (isEdit && equipmentId) {
        loadEquipment();
      }
    };
    init();
  }, []);

  const loadClients = async () => {
    try {
      const res = await fetch(`/api/admin/clients?user_id=${user?.id}&role=admin`);
      const data = await res.json();
      if (data.success) {
        setClients(data.clients || []);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoadingClients(false);
    }
  };

  const loadEquipment = async () => {
    try {
      const cleanClientId = String(prefilledClientId).replace(/::uuid$/, '');
      const res = await fetch(`/api/admin/equipment?user_id=${user?.id}&role=admin&client_id=${cleanClientId}`);
      const data = await res.json();
      if (data.success && data.equipment) {
        const eq = data.equipment.find((e: any) => e.id === equipmentId);
        if (eq) {
          setForm(prev => ({
            ...prev,
            client_id: String(eq.client_id).replace(/::uuid$/, ''),
            client_name: eq.client_name || '',
            name: eq.name || '',
            type: eq.type || 'mini_split',
            brand: eq.brand || '',
            model: eq.model || '',
            serial_number: eq.serial_number || '',
            capacity_tons: eq.capacity_tons ? String(eq.capacity_tons) : '',
            location_description: eq.location_description || '',
            notes: eq.notes || '',
          }));
        }
      }
    } catch (error) {
      console.error('Error loading equipment:', error);
    }
  };

  const selectClient = (client: Client) => {
    setForm({ ...form, client_id: client.id, client_name: client.name });
    setShowClientPicker(false);
  };

  const handleSubmit = async () => {
    if (!form.client_id) {
      setToast({ visible: true, message: 'Por favor selecciona un cliente.', type: 'error' });
      return;
    }
    if (!form.type || !form.location_description) {
      setToast({ visible: true, message: 'Por favor completa el tipo y la ubicación.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const sanitizedClientId = String(form.client_id).replace(/::uuid$/, '');
      const sanitizedId = String(equipmentId).replace(/::uuid$/, '');
      const payload = {
        ...(isEdit ? { id: sanitizedId } : {}),
        client_id: sanitizedClientId,
        name: form.name,
        type: form.type,
        brand: form.brand,
        model: form.model,
        serial_number: form.serial_number,
        location_description: form.location_description,
        notes: form.notes,
        capacity_tons: form.capacity_tons ? parseFloat(form.capacity_tons) : null,
      };

      const res = await fetch(`/api/admin/equipment?role=admin`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setToast({
          visible: true,
          message: `Equipo ${isEdit ? 'actualizado' : 'registrado'} exitosamente`,
          type: 'success',
        });
        setTimeout(() => router.back(), 1500);
      } else {
        setToast({
          visible: true,
          message: data.error || `No se pudo ${isEdit ? 'actualizar' : 'registrar'} el equipo.`,
          type: 'error',
        });
      }
    } catch {
      setToast({ visible: true, message: 'Error de red. Verifica tu conexión e intenta de nuevo.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F8FAFC' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, backgroundColor: '#F1F5F9', borderRadius: 10 }}>
            <ArrowLeftIcon size={20} color="#0F4C75" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#0D1B2A' }}>
            {isEdit ? 'Editar Equipo' : 'Nuevo Equipo'}
          </Text>
        </View>

        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            CLIENTE *
          </Text>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 14,
              backgroundColor: '#F8FAFC',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#E2E8F0',
            }}
            onPress={() => setShowClientPicker(!showClientPicker)}
            disabled={loadingClients}
          >
            {loadingClients ? (
              <ActivityIndicator size="small" color="#0F4C75" />
            ) : (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <UserIcon size={16} color={form.client_id ? '#0F4C75' : '#94a3b8'} />
                  <Text style={{ fontSize: 14, color: form.client_id ? '#0D1B2A' : '#94a3b8' }}>
                    {form.client_name || 'Seleccionar cliente'}
                  </Text>
                </View>
                <ChevronDownIcon size={18} color="#94a3b8" />
              </>
            )}
          </TouchableOpacity>

          {showClientPicker && (
            <View style={{ marginTop: 8, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, overflow: 'hidden' }}>
              {clients.map(client => (
                <TouchableOpacity
                  key={client.id}
                  style={{
                    padding: 12,
                    backgroundColor: form.client_id === client.id ? '#E8F4FD' : '#fff',
                    borderBottomWidth: 1,
                    borderBottomColor: '#F1F5F9',
                  }}
                  onPress={() => selectClient(client)}
                >
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#0D1B2A' }}>{client.name}</Text>
                  <Text style={{ fontSize: 12, color: '#64748b' }}>{client.email}</Text>
                </TouchableOpacity>
              ))}
              {clients.length === 0 && (
                <View style={{ padding: 16, alignItems: 'center' }}>
                  <Text style={{ color: '#94a3b8' }}>No hay clientes disponibles</Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            TIPO DE EQUIPO *
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {EQUIPMENT_TYPES.map(t => {
              const selected = form.type === t.key;
              return (
                <TouchableOpacity
                  key={t.key}
                  onPress={() => setForm({ ...form, type: t.key })}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: 10,
                    borderWidth: 1,
                    backgroundColor: selected ? '#0F4C75' : '#fff',
                    borderColor: selected ? '#0F4C75' : '#E2E8F0',
                  }}
                >
                  {selected && <AirVentIcon size={12} color="#fff" />}
                  <Text style={{ fontSize: 12, fontWeight: '600', color: selected ? '#fff' : '#64748b' }}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ marginTop: 16 }}>
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
              label="Capacidad (toneladas)"
              placeholder="Ej. 2 o 2.5"
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
        </View>

        <Button
          title={loading ? (isEdit ? 'Actualizando...' : 'Guardando...') : (isEdit ? 'Actualizar Equipo' : 'Guardar Equipo')}
          onPress={handleSubmit}
          loading={loading}
          style={{ marginBottom: 12 }}
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
