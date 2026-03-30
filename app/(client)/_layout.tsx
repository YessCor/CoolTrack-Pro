import { Tabs } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { TouchableOpacity, View, Text, Platform } from 'react-native';
import { HomeIcon, ClipboardIcon, LayersIcon, LogOutIcon, AirVentIcon } from '../../components/ui/Icons';
import { AnimatedTabIcon } from '../../components/ui/AnimatedTabIcon';

const ICON_ACTIVE = '#00B4D8';
const ICON_INACTIVE = '#6BAED6';



export default function ClientLayout() {
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
        tabBarActiveTintColor: ICON_ACTIVE,
        tabBarInactiveTintColor: ICON_INACTIVE,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', letterSpacing: 0.5, marginTop: 2 },
        headerLeft: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 16, gap: 8 }}>
            <AirVentIcon size={20} color="#00B4D8" />
            <Text style={{ color: '#00B4D8', fontWeight: '800', fontSize: 14, letterSpacing: 1 }}>
              COOLTRACK
            </Text>
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={logout}
            style={{ marginRight: 16 }}
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
          title: 'Inicio',
          headerTitle: 'Mis Solicitudes',
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused} icon={<HomeIcon size={22} color={focused ? ICON_ACTIVE : ICON_INACTIVE} strokeWidth={focused ? 2.2 : 1.6} />} />
          ),
        }}
      />
      <Tabs.Screen
        name="equipment"
        options={{
          title: 'Equipos',
          headerTitle: 'Mis Equipos',
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused} icon={<LayersIcon size={22} color={focused ? ICON_ACTIVE : ICON_INACTIVE} strokeWidth={focused ? 2.2 : 1.6} />} />
          ),
        }}
      />
      <Tabs.Screen name="new-request" options={{ href: null }} />
      <Tabs.Screen name="new-equipment" options={{ href: null }} />
      <Tabs.Screen name="quote/[id]" options={{ href: null }} />
      <Tabs.Screen name="service/[id]" options={{ href: null }} />
    </Tabs>
  );
}

