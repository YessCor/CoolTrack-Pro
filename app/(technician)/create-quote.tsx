import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { apiCall } from '../../lib/api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { FileTextIcon, PlusIcon, XIcon, ClipboardIcon } from '../../components/ui/Icons';
import { Toast } from '../../components/ui/Toast';

interface Item {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export default function CreateQuote() {
  const router = useRouter();
  const { user } = useAuth();
  const { order_id, client_id, order_number } = useLocalSearchParams<{
    order_id: string; client_id: string; order_number: string;
  }>();

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState({ description: '', unit_price: '' });

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.16;
  const total = subtotal + tax;

  const addItem = () => {
    if (!newItem.description || !newItem.unit_price) {
      Alert.alert('Campos requeridos', 'Completa el concepto y el costo.');
      return;
    }
    const price = parseFloat(newItem.unit_price);
    if (isNaN(price) || price <= 0) {
      Alert.alert('Valor inválido', 'El costo debe ser un número mayor a 0.');
      return;
    }
    setItems([...items, { id: Date.now().toString(), description: newItem.description, quantity: 1, unit_price: price, total: price }]);
    setNewItem({ description: '', unit_price: '' });
  };

  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id));

  const handleSubmit = async () => {
    if (items.length === 0) {
      Alert.alert('Sin ítems', 'Agrega al menos un concepto a la cotización.');
      return;
    }
    setLoading(true);
    try {
      const { success, error } = await apiCall(`/api/quotes?user_id=${user?.id}&role=${user?.role}`, {
        method: 'POST',
        body: JSON.stringify({
          order_id, client_id,
          items: items.map(({ description, quantity, unit_price, total }) => ({ description, quantity, unit_price, total })),
          notes: `Cotización para Orden #${order_number}`,
        }),
      });
      if (success) {
        setToast({
          visible: true,
          message: 'Cotización enviada exitosamente. El cliente la recibirá para su aprobación.',
          type: 'success',
        });
        setTimeout(() => router.back(), 1500);
      } else {
        setToast({
          visible: true,
          message: error || 'No se pudo crear la cotización.',
          type: 'error',
        });
      }
    } catch { Alert.alert('Error de conexión', 'No se pudo contactar con el servidor.'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
      <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
      {/* Dark header */}
      <View className="bg-ink px-5 pt-5 pb-10">
        <View className="flex-row items-center gap-2 mb-1">
          <FileTextIcon size={16} color="#00B4D8" />
          <Text style={{ color: '#00B4D8', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 }}>ORDEN #{order_number}</Text>
        </View>
        <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '700' }}>Generar cotización</Text>
        <Text style={{ color: '#4A6785', fontSize: 13, marginTop: 3 }}>Añade conceptos y envíala al cliente.</Text>
      </View>

      <View style={{ marginTop: -20, marginHorizontal: 16, gap: 12 }}>

        {/* Add item form */}
        <View className="bg-surface-card rounded-2xl border border-surface-border p-4">
          <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 14, marginBottom: 12 }}>Nuevo concepto</Text>
          <Input
            label="Descripción / Refacción"
            placeholder="Ej. Gas Refrigerante R410A"
            value={newItem.description}
            onChangeText={(v) => setNewItem({ ...newItem, description: v })}
          />
          <Input
            label="Costo ($)"
            placeholder="250.00"
            keyboardType="numeric"
            value={newItem.unit_price}
            onChangeText={(v) => setNewItem({ ...newItem, unit_price: v })}
          />
          <Button
            title="Añadir a la lista"
            variant="secondary"
            icon={<PlusIcon size={16} color="#0D1B2A" />}
            onPress={addItem}
            className="w-full"
          />
        </View>

        {/* Items list */}
        <View className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden">
          <View className="px-4 py-3 border-b border-surface-border flex-row items-center gap-2">
            <ClipboardIcon size={15} color="#0F4C75" />
            <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 14 }}>
              Detalle de la cotización
            </Text>
            {items.length > 0 && (
              <View className="ml-auto bg-brand rounded-full px-2 py-0.5">
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{items.length}</Text>
              </View>
            )}
          </View>

          {items.length === 0 ? (
            <View className="py-10 items-center gap-2 px-6">
              <FileTextIcon size={28} color="#94a3b8" />
              <Text style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center' }}>
                Sin conceptos. Añade el primero arriba.
              </Text>
            </View>
          ) : (
            <View>
              {items.map((item, idx) => (
                <View
                  key={item.id}
                  className="flex-row items-center px-4 py-3 border-b border-surface-border"
                  style={{ borderBottomWidth: idx === items.length - 1 ? 0 : 1 }}
                >
                  <View className="flex-1 mr-3">
                    <Text style={{ fontWeight: '600', color: '#0D1B2A', fontSize: 14 }}>{item.description}</Text>
                    <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 1 }}>
                      1 × ${item.unit_price.toFixed(2)}
                    </Text>
                  </View>
                  <Text style={{ fontWeight: '700', color: '#0F4C75', fontSize: 15, marginRight: 12 }}>
                    ${item.total.toFixed(2)}
                  </Text>
                  <TouchableOpacity onPress={() => removeItem(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <XIcon size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Totals */}
          {items.length > 0 && (
            <View className="px-4 py-4 gap-2 bg-surface border-t border-surface-border">
              <View className="flex-row justify-between">
                <Text style={{ color: '#64748b', fontSize: 13 }}>Subtotal</Text>
                <Text style={{ color: '#0D1B2A', fontWeight: '600', fontSize: 13 }}>${subtotal.toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text style={{ color: '#64748b', fontSize: 13 }}>IVA (16%)</Text>
                <Text style={{ color: '#0D1B2A', fontWeight: '600', fontSize: 13 }}>${tax.toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between pt-2 mt-1 border-t border-surface-border">
                <Text style={{ color: '#0D1B2A', fontWeight: '800', fontSize: 16 }}>Total</Text>
                <Text style={{ color: '#0F4C75', fontWeight: '800', fontSize: 20 }}>${total.toFixed(2)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Actions */}
        {loading ? (
          <View className="items-center py-4">
            <ActivityIndicator color="#0F4C75" />
            <Text style={{ color: '#64748b', fontSize: 13, marginTop: 8 }}>Enviando cotización...</Text>
          </View>
        ) : (
          <>
            <Button
              title="Enviar cotización al cliente"
              onPress={handleSubmit}
              disabled={items.length === 0}
              size="lg"
              className="w-full"
            />
            <Button title="Cancelar" variant="outline" onPress={() => router.back()} className="w-full" />
          </>
        )}
      </View>
    </ScrollView>
    </>
  );
}
