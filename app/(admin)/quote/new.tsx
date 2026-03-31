import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { FileTextIcon, PlusIcon, XIcon, ClipboardIcon, ChevronDownIcon, ArrowLeftIcon, MapPinIcon } from '../../../components/ui/Icons';
import { Toast } from '../../../components/ui/Toast';
import { apiCall } from '../../../lib/api';

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface OrderOption {
  id: string;
  order_number: number;
  client_name: string;
  client_id: string;
  service_type: string;
  description: string;
  address: string;
}

export default function CreateQuoteScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams();
  
  const orderIdParam = params.order_id as string;
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [newItem, setNewItem] = useState({ description: '', unit_price: '' });
  const [notes, setNotes] = useState('');
  const [validDays, setValidDays] = useState('7');
  
  const [orders, setOrders] = useState<OrderOption[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderOption | null>(null);
  const [showOrderPicker, setShowOrderPicker] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.16;
  const total = subtotal + tax;

  useEffect(() => {
    if (orderIdParam) {
      loadOrderById(orderIdParam);
    }
    loadPendingOrders();
  }, [orderIdParam]);

  const loadOrderById = async (id: string) => {
    try {
      const res = await fetch(`/api/orders?user_id=${user?.id}&role=admin`);
      const data = await res.json();
      if (data.success) {
        const order = data.orders?.find((o: any) => o.id === id);
        if (order) {
          setSelectedOrder({
            id: order.id,
            order_number: order.order_number,
            client_name: order.client_name || 'Cliente',
            client_id: order.client_id,
            service_type: order.service_type,
            description: order.description,
            address: order.address,
          });
        }
      }
    } catch (e) { console.error(e); }
  };

  const loadPendingOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`/api/orders?user_id=${user?.id}&role=admin`);
      const data = await res.json();
      if (data.success) {
        const pendingOrders = (data.orders || []).filter((o: any) => 
          ['pending', 'assigned', 'accepted'].includes(o.status?.toLowerCase())
        );
        setOrders(pendingOrders.map((o: any) => ({
          id: o.id,
          order_number: o.order_number,
          client_name: o.client_name || 'Cliente',
          client_id: o.client_id,
          service_type: o.service_type,
          description: o.description,
          address: o.address,
        })));
      }
    } catch (e) { console.error(e); }
    finally { setLoadingOrders(false); }
  };

  const addItem = () => {
    if (!newItem.description || !newItem.unit_price) {
      setToast({ visible: true, message: 'Completa descripción y costo.', type: 'error' });
      return;
    }
    const price = parseFloat(newItem.unit_price);
    if (isNaN(price) || price <= 0) {
      setToast({ visible: true, message: 'El costo debe ser mayor a 0.', type: 'error' });
      return;
    }
    setItems([...items, { id: Date.now().toString(), description: newItem.description, quantity: 1, unit_price: price, total: price }]);
    setNewItem({ description: '', unit_price: '' });
  };

  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id));

  const handleSubmit = async () => {
    if (!selectedOrder) {
      setToast({ visible: true, message: 'Selecciona una orden.', type: 'error' });
      return;
    }
    if (items.length === 0) {
      setToast({ visible: true, message: 'Agrega al menos un concepto.', type: 'error' });
      return;
    }

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + parseInt(validDays || '7'));

    setLoading(true);
    try {
      const { success, error } = await apiCall(`/api/quotes?user_id=${user?.id}&role=admin`, {
        method: 'POST',
        body: JSON.stringify({
          order_id: selectedOrder.id,
          client_id: selectedOrder.client_id,
          items: items.map(({ description, quantity, unit_price, total }) => ({ description, quantity, unit_price, total })),
          notes: notes || `Cotización para Orden #${selectedOrder.order_number}`,
          valid_until: validUntil.toISOString(),
        }),
      });
      
      if (success) {
        setToast({ visible: true, message: 'Cotización creada y enviada al cliente.', type: 'success' });
        setTimeout(() => router.back(), 1500);
      } else {
        setToast({ visible: true, message: error || 'No se pudo crear la cotización.', type: 'error' });
      }
    } catch {
      setToast({ visible: true, message: 'Error de conexión.', type: 'error' });
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
      <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <View className="bg-ink px-5 pt-5 pb-8">
          <View className="flex-row items-center gap-3 mb-4">
            <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-xl" style={{ backgroundColor: '#1A3A5C' }}>
              <ArrowLeftIcon size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800' }}>Nueva Cotización</Text>
          </View>
          <Text style={{ color: '#4A6785', fontSize: 13 }}>Crea la cotización y envíala al cliente para su aprobación.</Text>
        </View>

        <View style={{ marginTop: -16, marginHorizontal: 16, gap: 12 }}>
          <TouchableOpacity
            onPress={() => setShowOrderPicker(true)}
            className="bg-surface-card rounded-2xl border border-surface-border p-4"
          >
            <Text style={{ fontWeight: '700', color: '#64748b', fontSize: 12, marginBottom: 8, textTransform: 'uppercase' }}>Orden *</Text>
            {selectedOrder ? (
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-brand/10 items-center justify-center">
                  <FileTextIcon size={18} color="#0F4C75" />
                </View>
                <View className="flex-1">
                  <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 14 }}>#{selectedOrder.order_number} - {selectedOrder.service_type}</Text>
                  <Text style={{ color: '#64748b', fontSize: 12 }}>{selectedOrder.client_name}</Text>
                </View>
                <ChevronDownIcon size={18} color="#94a3b8" />
              </View>
            ) : (
              <View className="flex-row items-center gap-3">
                <ClipboardIcon size={20} color="#94a3b8" />
                <Text style={{ color: '#94a3b8', fontSize: 14 }}>Seleccionar orden (opcional)</Text>
              </View>
            )}
          </TouchableOpacity>

          <View className="bg-surface-card rounded-2xl border border-surface-border p-4">
            <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 14, marginBottom: 12 }}>Agregar concepto</Text>
            <Input
              label="Descripción / Servicio"
              placeholder="Ej. Mantenimiento preventivo"
              value={newItem.description}
              onChangeText={(v) => setNewItem({ ...newItem, description: v })}
            />
            <Input
              label="Costo ($)"
              placeholder="0.00"
              keyboardType="numeric"
              value={newItem.unit_price}
              onChangeText={(v) => setNewItem({ ...newItem, unit_price: v })}
            />
            <Button
              title="Agregar"
              variant="secondary"
              icon={<PlusIcon size={16} color="#0D1B2A" />}
              onPress={addItem}
              className="w-full mt-2"
            />
          </View>

          <View className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden">
            <View className="px-4 py-3 border-b border-surface-border flex-row items-center gap-2">
              <ClipboardIcon size={15} color="#0F4C75" />
              <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 14 }}>Conceptos</Text>
              {items.length > 0 && (
                <View className="ml-auto bg-brand rounded-full px-2 py-0.5">
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{items.length}</Text>
                </View>
              )}
            </View>

            {items.length === 0 ? (
              <View className="py-10 items-center gap-2 px-6">
                <FileTextIcon size={28} color="#94a3b8" />
                <Text style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center' }}>Sin conceptos aún</Text>
              </View>
            ) : (
              items.map((item, idx) => (
                <View key={item.id} className="flex-row items-center px-4 py-3 border-b border-surface-border" style={{ borderBottomWidth: idx === items.length - 1 ? 0 : 1 }}>
                  <View className="flex-1 mr-3">
                    <Text style={{ fontWeight: '600', color: '#0D1B2A', fontSize: 14 }}>{item.description}</Text>
                    <Text style={{ color: '#94a3b8', fontSize: 12 }}>1 × ${item.unit_price.toFixed(2)}</Text>
                  </View>
                  <Text style={{ fontWeight: '700', color: '#0F4C75', fontSize: 15, marginRight: 12 }}>${item.total.toFixed(2)}</Text>
                  <TouchableOpacity onPress={() => removeItem(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <XIcon size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))
            )}

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

          <View className="bg-surface-card rounded-2xl border border-surface-border p-4">
            <Input
              label="Notas (opcional)"
              placeholder="Términos, condiciones o información adicional..."
              multiline
              numberOfLines={3}
              value={notes}
              onChangeText={setNotes}
            />
            <View className="mt-3">
              <Text style={{ fontWeight: '600', color: '#64748b', fontSize: 12, marginBottom: 8 }}>Validez (días)</Text>
              <View className="flex-row gap-2">
                {['7', '15', '30'].map(d => (
                  <TouchableOpacity
                    key={d}
                    onPress={() => setValidDays(d)}
                    className="flex-1 py-2.5 rounded-xl border"
                    style={{ backgroundColor: validDays === d ? '#0F4C75' : '#fff', borderColor: validDays === d ? '#0F4C75' : '#E2E8F0' }}
                  >
                    <Text style={{ textAlign: 'center', fontWeight: '600', fontSize: 13, color: validDays === d ? '#fff' : '#64748b' }}>{d} días</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {loading ? (
            <View className="items-center py-4">
              <ActivityIndicator color="#0F4C75" />
              <Text style={{ color: '#64748b', fontSize: 13, marginTop: 8 }}>Enviando...</Text>
            </View>
          ) : (
            <>
              <Button title="Enviar cotización" onPress={handleSubmit} size="lg" className="w-full" />
              <Button title="Cancelar" variant="outline" onPress={() => router.back()} className="w-full" />
            </>
          )}
        </View>
      </ScrollView>

      <Modal visible={showOrderPicker} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl" style={{ maxHeight: '70%' }}>
            <View className="px-5 py-4 border-b border-surface-border flex-row items-center justify-between">
              <Text style={{ fontSize: 17, fontWeight: '700', color: '#0D1B2A' }}>Seleccionar Orden</Text>
              <TouchableOpacity onPress={() => setShowOrderPicker(false)}>
                <XIcon size={22} color="#64748b" />
              </TouchableOpacity>
            </View>
            {loadingOrders ? (
              <View className="p-8 items-center"><ActivityIndicator color="#0F4C75" /></View>
            ) : (
              <FlatList
                data={orders}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 12, gap: 8 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => { setSelectedOrder(item); setShowOrderPicker(false); }}
                    className="flex-row items-center gap-3 p-4 rounded-xl border"
                    style={{ borderColor: selectedOrder?.id === item.id ? '#0F4C75' : '#E2E8F0', backgroundColor: selectedOrder?.id === item.id ? '#E8F4FD' : '#fff' }}
                  >
                    <View className="w-10 h-10 rounded-lg bg-brand/10 items-center justify-center">
                      <FileTextIcon size={18} color="#0F4C75" />
                    </View>
                    <View className="flex-1">
                      <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 14 }}>#{item.order_number} - {item.service_type}</Text>
                      <Text style={{ color: '#64748b', fontSize: 12 }}>{item.client_name}</Text>
                      <View className="flex-row items-center gap-1 mt-1">
                        <MapPinIcon size={10} color="#94a3b8" />
                        <Text style={{ color: '#94a3b8', fontSize: 11 }} numberOfLines={1}>{item.address}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View className="p-8 items-center">
                    <Text style={{ color: '#94a3b8' }}>No hay órdenes disponibles</Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}
