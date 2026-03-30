import { Tabs } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { TouchableOpacity, View, Text, Platform } from 'react-native';
import { ClipboardIcon, UserIcon, LogOutIcon, AirVentIcon } from '../../components/ui/Icons';

export default function TechnicianLayout() {
  const { logout } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#0D1B2A' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700', fontSize: 17, letterSpacing: 0.3 },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: '#0D1B2A',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 85 : 68,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#4A6785',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', letterSpacing: 0.5, marginTop: 2 },
        headerLeft: () => (
          <View className="flex-row items-center ml-4 gap-2">
            <AirVentIcon size={20} color="#00B4D8" />
            <Text style={{ color: '#00B4D8', fontWeight: '800', fontSize: 14, letterSpacing: 1 }}>
              COOLTRACK
            </Text>
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={logout}
            className="mr-4"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <LogOutIcon size={18} color="#EF4444" />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trabajos',
          headerTitle: 'Agenda del Día',
          tabBarIcon: ({ focused }) => (
            <View className={`items-center justify-center w-12 h-12 rounded-2xl ${focused ? 'bg-brand' : ''}`}>
              <ClipboardIcon size={20} color={focused ? '#fff' : '#4A6785'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          headerTitle: 'Mi Perfil',
          tabBarIcon: ({ focused }) => (
            <View className={`items-center justify-center w-12 h-12 rounded-2xl ${focused ? 'bg-brand' : ''}`}>
              <UserIcon size={20} color={focused ? '#fff' : '#4A6785'} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
