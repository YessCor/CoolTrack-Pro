import { Tabs } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { TouchableOpacity, Text } from 'react-native';

export default function TechnicianLayout() {
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
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Trabajos',
          headerTitle: 'Trabajos de Hoy'
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Perfil',
          headerTitle: 'Mi Perfil'
        }} 
      />
    </Tabs>
  );
}
