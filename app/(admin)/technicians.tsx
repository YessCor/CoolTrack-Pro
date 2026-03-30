import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { MailIcon, PhoneIcon, PlusIcon, UserIcon, ShieldIcon } from '../../components/ui/Icons';

export default function AdminTechnicians() {
  const router = useRouter();
  const [techs, setTechs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTechs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/technicians');
      const data = await res.json();
      if (data.success) setTechs(data.technicians);
      else Alert.alert('Error', 'No se pudieron cargar los técnicos.');
    } catch { console.error('Fetch techs error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTechs(); }, []);

  return (
    <View className="flex-1 bg-surface">
      {/* Subheader */}
      <View className="bg-surface-card border-b border-surface-border px-4 py-3 flex-row items-center justify-between">
        <Text style={{ color: '#64748b', fontSize: 13, fontWeight: '600' }}>
          {techs.length} técnico{techs.length !== 1 ? 's' : ''} registrado{techs.length !== 1 ? 's' : ''}
        </Text>
        <Button
          title="Nuevo técnico"
          size="sm"
          icon={<PlusIcon size={14} color="#fff" />}
          onPress={() => router.push('/(admin)/create-technician')}
        />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0F4C75" />
        </View>
      ) : (
        <FlatList
          data={techs}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          onRefresh={fetchTechs}
          refreshing={loading}
          renderItem={({ item }: any) => (
            <View className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden">
              <View className="px-4 py-4 flex-row items-center gap-3">
                {/* Avatar */}
                <View className="w-12 h-12 rounded-full bg-brand items-center justify-center">
                  <UserIcon size={22} color="#fff" />
                </View>
                {/* Info */}
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 15 }}>{item.name}</Text>
                    {item.is_active && <ShieldIcon size={14} color="#10B981" />}
                  </View>
                  <View className="flex-row items-center gap-1.5 mt-1">
                    <MailIcon size={12} color="#94a3b8" />
                    <Text style={{ color: '#64748b', fontSize: 12 }}>{item.email}</Text>
                  </View>
                  {item.phone && (
                    <View className="flex-row items-center gap-1.5 mt-0.5">
                      <PhoneIcon size={12} color="#94a3b8" />
                      <Text style={{ color: '#64748b', fontSize: 12 }}>{item.phone}</Text>
                    </View>
                  )}
                </View>
                {/* Status pill */}
                <View
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: item.is_active ? '#ECFDF5' : '#F1F5F9' }}
                >
                  <Text style={{
                    fontSize: 11, fontWeight: '700',
                    color: item.is_active ? '#059669' : '#94a3b8',
                    letterSpacing: 0.5,
                  }}>
                    {item.is_active ? 'ACTIVO' : 'INACTIVO'}
                  </Text>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            !loading ? (
              <View className="items-center py-20 gap-3">
                <View className="w-16 h-16 rounded-2xl bg-surface-hover items-center justify-center">
                  <UserIcon size={28} color="#94a3b8" />
                </View>
                <Text style={{ color: '#94a3b8', fontWeight: '600' }}>Sin técnicos registrados</Text>
                <Button
                  title="Agregar el primero"
                  variant="outline"
                  size="sm"
                  onPress={() => router.push('/(admin)/create-technician')}
                />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}
