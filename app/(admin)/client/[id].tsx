import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeftIcon, SaveIcon } from '../../../components/ui/Icons';
import { getClient, createClientRepository, updateClientRepository } from '../../../lib/repositories/client-repository';
import { Client } from '../../../lib/models/client';
import { useAuth } from '../../../context/AuthContext';
import { Toast } from '../../../components/ui/Toast';
import { apiCall } from '../../../lib/api';

export default function ClientForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const isEditing = !!id && id !== 'new';

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });
  const [form, setForm] = useState({
    name: '',
    contact_name: '',
    email: '',
    phone: '',
    alternate_phone: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    if (isEditing && id) {
      loadClient();
    }
  }, [id]);

  const loadClient = async () => {
    if (!user?.id) return;
    try {
      const client = await getClient(id!, user.id, user.role || 'admin');
      if (client) {
        setForm({
          name: client.name || '',
          contact_name: (client as any).contact_name || '',
          email: client.email || '',
          phone: client.phone || '',
          alternate_phone: (client as any).alternate_phone || '',
          address: client.address || '',
          notes: (client as any).notes || '',
        });
      }
    } catch (error) {
      console.error('Error loading client:', error);
      Alert.alert('Error', 'No se pudo cargar el cliente');
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setToast({ visible: true, message: 'El nombre es requerido', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      if (isEditing && id) {
        const { success, error } = await apiCall(`/api/admin/clients/${id}?user_id=${user?.id}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
        if (success) {
          setToast({ visible: true, message: 'Cliente actualizado correctamente', type: 'success' });
          setTimeout(() => router.back(), 1500);
        } else {
          setToast({ visible: true, message: error || 'No se pudo actualizar', type: 'error' });
        }
      } else {
        await createClientRepository(form, user?.id || '');
        setToast({ visible: true, message: 'Cliente creado correctamente', type: 'success' });
        setTimeout(() => router.back(), 1500);
      }
    } catch (error) {
      console.error('Error saving client:', error);
      setToast({ visible: true, message: 'No se pudo guardar el cliente', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeftIcon size={24} color="#0F4C75" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={loading}
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
        >
          <SaveIcon size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Principal</Text>
          
          <View style={styles.field}>
            <Text style={styles.label}>Nombre/Razón Social *</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(v) => updateField('name', v)}
              placeholder="Ej: Empresa ABC S.A."
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Nombre de contacto</Text>
            <TextInput
              style={styles.input}
              value={form.contact_name}
              onChangeText={(v) => updateField('contact_name', v)}
              placeholder="Ej: Juan Pérez"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacto</Text>
          
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={form.email}
              onChangeText={(v) => updateField('email', v)}
              placeholder="correo@ejemplo.com"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.field, styles.fieldHalf]}>
              <Text style={styles.label}>Teléfono</Text>
              <TextInput
                style={styles.input}
                value={form.phone}
                onChangeText={(v) => updateField('phone', v)}
                placeholder="555-123-4567"
                placeholderTextColor="#94a3b8"
                keyboardType="phone-pad"
              />
            </View>
            <View style={[styles.field, styles.fieldHalf]}>
              <Text style={styles.label}>Teléfono alternativo</Text>
              <TextInput
                style={styles.input}
                value={form.alternate_phone}
                onChangeText={(v) => updateField('alternate_phone', v)}
                placeholder="555-987-6543"
                placeholderTextColor="#94a3b8"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dirección</Text>
          
          <View style={styles.field}>
            <Text style={styles.label}>Dirección completa</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={form.address}
              onChangeText={(v) => updateField('address', v)}
              placeholder="Calle, número, colonia, ciudad, estado, CP"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notas</Text>
          
          <View style={styles.field}>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={form.notes}
              onChangeText={(v) => updateField('notes', v)}
              placeholder="Notas adicionales sobre el cliente..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0D1B2A',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F4C75',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  form: {
    flex: 1,
  },
  formContent: {
    padding: 16,
    gap: 24,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  field: {
    gap: 6,
  },
  fieldHalf: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0D1B2A',
    backgroundColor: '#F8FAFC',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
