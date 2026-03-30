import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { mockClients } from '../../mocks/data';
import { UserIcon, ClipboardIcon } from '../../components/ui/Icons';

export default function AdminClients() {
  return (
    <View className="flex-1 bg-surface">
      <View className="bg-surface-card border-b border-surface-border px-4 py-3">
        <Text style={{ color: '#64748b', fontSize: 13, fontWeight: '600' }}>
          {mockClients.length} cliente{mockClients.length !== 1 ? 's' : ''} registrado{mockClients.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={mockClients}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item }) => (
          <View className="bg-surface-card rounded-2xl border border-surface-border">
            <View className="px-4 py-4 flex-row items-center gap-3">
              <View className="w-11 h-11 rounded-full bg-brand/10 items-center justify-center">
                <UserIcon size={20} color="#0F4C75" />
              </View>
              <View className="flex-1">
                <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 15 }}>{item.name}</Text>
                <Text style={{ color: '#94a3b8', fontSize: 11, marginTop: 1 }}>ID: {item.id}</Text>
              </View>
              <View className="flex-row items-center gap-1.5 bg-brand/8 px-3 py-1.5 rounded-xl" style={{ backgroundColor: '#E8F4FD' }}>
                <ClipboardIcon size={13} color="#0F4C75" />
                <Text style={{ color: '#0F4C75', fontWeight: '700', fontSize: 12 }}>
                  {item.pendingOrders}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}
