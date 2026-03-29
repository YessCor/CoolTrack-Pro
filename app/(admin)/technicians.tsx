import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function AdminTechnicians() {
  const router = useRouter();
  const [techs, setTechs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTechs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/technicians');
      const data = await response.json();
      if (data.success) {
        setTechs(data.technicians);
      } else {
        Alert.alert('Error', 'No se pudieron cargar los técnicos.');
      }
    } catch (error) {
      console.error('Fetch techs error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechs();
  }, []);

  return (
    <View className="flex-1 bg-slate-50">
      <View className="p-4 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-slate-800">Directorio de Staff</Text>
        <Button 
          title="+ Nuevo" 
          onPress={() => router.push('/(admin)/create-technician')} 
          className="px-4 py-2"
        />
      </View>

      <FlatList
        data={techs}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={{ padding: 16 }}
        onRefresh={fetchTechs}
        refreshing={loading}
        renderItem={({ item }) => (
          <Card className="mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-bold text-slate-800">{item.name}</Text>
              <Text className={`font-bold ${item.is_active ? 'text-green-600' : 'text-slate-400'}`}>
                {item.is_active ? 'Activo' : 'Inactivo'}
              </Text>
            </View>
            <Text className="text-slate-600 font-medium">✉️ {item.email}</Text>
            {item.phone && <Text className="text-slate-500 text-sm mt-1">📞 {item.phone}</Text>}
          </Card>
        )}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center py-10">
              <Text className="text-slate-400">No hay técnicos registrados aún.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
