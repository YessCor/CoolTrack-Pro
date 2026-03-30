import { Tabs } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { TouchableOpacity, Text } from 'react-native';

export default function AdminLayout() {
  const { logout } = useAuth();
  
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#1E40AF',
      headerRight: () => (
        <TouchableOpacity onPress={logout} className="mr-4">
          <Text className="text-status-cancelled font-semibold">Salir</Text>
        </TouchableOpacity>
      )
    }}>
      <Tabs.Screen name="index" options={{ title: 'Global', headerTitle: 'Dashboard Admin' }} />
      <Tabs.Screen name="orders" options={{ title: 'Órdenes', headerTitle: 'Gestión General' }} />
      <Tabs.Screen name="quotes" options={{ title: 'Cotizaciones', headerTitle: 'Gestión Comercial' }} />
      <Tabs.Screen name="technicians" options={{ title: 'Staff', headerTitle: 'Técnicos' }} />
      <Tabs.Screen name="clients" options={{ title: 'Clientes', headerTitle: 'Directorio Clientes' }} />
    </Tabs>
  );
}
