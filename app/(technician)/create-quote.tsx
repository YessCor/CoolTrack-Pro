import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { apiCall } from '../../lib/api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

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
    order_id: string; 
    client_id: string; 
    order_number: string;
  }>();

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState({ description: '', unit_price: '' });

  // Cálculos
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.16;
  const total = subtotal + tax;

  const addItem = () => {
    if (!newItem.description || !newItem.unit_price) {
      Alert.alert('Error', 'Por favor llena el concepto y el costo.');
      return;
    }

    const price = parseFloat(newItem.unit_price);
    if (isNaN(price)) {
      Alert.alert('Error', 'El costo debe ser un número válido.');
      return;
    }

    const item: Item = {
      id: Date.now().toString(),
      description: newItem.description,
      quantity: 1,
      unit_price: price,
      total: price
    };

    setItems([...items, item]);
    setNewItem({ description: '', unit_price: '' });
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      Alert.alert('Error', 'Agrega al menos un concepto a la cotización.');
      return;
    }

    setLoading(true);
    try {
      const { success, error, data } = await apiCall(`/api/quotes?user_id=${user?.id}&role=${user?.role}`, {
        method: 'POST',
        body: JSON.stringify({
          order_id,
          client_id,
          items: items.map(({ description, quantity, unit_price, total }) => ({
            description,
            quantity,
            unit_price,
            total
          })),
          notes: `Cotización para Orden #${order_number}`
        })
      });

      if (success) {
        Alert.alert('✅ Éxito', 'Cotización enviada al cliente correctamente.', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        console.error('[SUBMIT-QUOTE] API Error:', error);
        Alert.alert('Error', error || 'No se pudo crear la cotización.');
      }
    } catch (error) {
      console.error('[SUBMIT-QUOTE] Connection Error:', error);
      Alert.alert('Error de conexión', 'No se pudo contactar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <Text className="text-2xl font-bold text-slate-800 mb-2 mt-4">Generar Cotización</Text>
      <Text className="text-slate-500 mb-6 font-medium">Orden #{order_number}</Text>
      
      <View className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-6">
        <Input 
          label="Concepto / Refacción" 
          placeholder="Ej. Gas Refrigerante R410A" 
          value={newItem.description}
          onChangeText={(val) => setNewItem({ ...newItem, description: val })}
        />
        <Input 
          label="Costo ($)" 
          placeholder="250.00" 
          keyboardType="numeric" 
          value={newItem.unit_price}
          onChangeText={(val) => setNewItem({ ...newItem, unit_price: val })}
        />
        
        <Button 
          title="+ Añadir a la lista" 
          variant="secondary" 
          onPress={addItem}
          className="mb-4" 
        />

        <Text className="text-lg font-bold text-slate-800 mb-4 mt-2">Detalle de la Cotización</Text>
        
        {items.length === 0 ? (
          <View className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200 mb-6">
            <Text className="text-slate-400 text-center italic">No hay ítems en la lista.</Text>
          </View>
        ) : (
          <View className="mb-6">
            {items.map((item) => (
              <View key={item.id} className="flex-row justify-between items-center bg-slate-50 p-3 rounded-xl mb-2 border border-slate-100">
                <View className="flex-1">
                  <Text className="font-bold text-slate-800">{item.description}</Text>
                  <Text className="text-slate-500 text-xs">${item.unit_price.toFixed(2)}</Text>
                </View>
                <TouchableOpacity onPress={() => removeItem(item.id)}>
                   <Text className="text-red-500 font-bold px-2">Quitar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View className="border-t border-slate-100 pt-4 mb-6">
           <View className="flex-row justify-between mb-2">
             <Text className="text-slate-500">Subtotal</Text>
             <Text className="text-slate-700 font-medium">${subtotal.toFixed(2)}</Text>
           </View>
           <View className="flex-row justify-between mb-2">
             <Text className="text-slate-500">IVA (16%)</Text>
             <Text className="text-slate-700 font-medium">${tax.toFixed(2)}</Text>
           </View>
           <View className="flex-row justify-between mt-2 pt-2 border-t border-slate-100">
             <Text className="font-bold text-lg text-slate-800">Total</Text>
             <Text className="font-bold text-xl text-primary">${total.toFixed(2)}</Text>
           </View>
        </View>

        {loading ? (
          <ActivityIndicator color="#1E40AF" size="large" />
        ) : (
          <>
            <Button 
              title="Enviar Cotización al Cliente" 
              onPress={handleSubmit} 
              disabled={items.length === 0}
            />
            <Button 
              title="Cancelar" 
              variant="outline" 
              className="mt-3" 
              onPress={() => router.back()} 
            />
          </>
        )}
      </View>
      <View className="h-20" />
    </ScrollView>
  );
}
