import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { mockOrders } from '../../mocks/data';

export default function AdminOrders() {
  const [filter, setFilter] = useState('ALL');

  const filters = ['ALL', 'PENDING', 'ON_THE_WAY', 'ON_SITE', 'IN_PROGRESS', 'COMPLETED'];

  return (
    <View className="flex-1 bg-slate-50">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-slate-800 mb-4">Monitor de Órdenes</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2 flex-row">
          {filters.map(f => (
            <TouchableOpacity 
              key={f}
              onPress={() => setFilter(f)}
              className={`px-4 py-2 rounded-full mr-2 border ${filter === f ? 'bg-slate-800 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              <Text className={filter === f ? 'text-white font-bold' : 'text-slate-600 font-medium'}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={mockOrders.filter(o => filter === 'ALL' || o.status === filter)}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity className="mb-4">
            <Card>
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-lg font-bold text-slate-800 flex-1 mr-2">#{item.id} - {item.title}</Text>
                <StatusBadge status={item.status} />
              </View>
              <Text className="text-slate-500 mb-1">📅 {item.date}</Text>
              <Text className="text-slate-600 font-medium mb-1">👨‍🔧 Técnico: {item.technician || 'Sin asignar'}</Text>
              <Text className="text-slate-500 text-sm">📍 {item.address}</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
