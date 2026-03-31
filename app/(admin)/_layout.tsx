import { Tabs } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { TouchableOpacity, Text, View } from 'react-native';
import { MinimalTabIcon } from '../../components/ui/MinimalTabIcon';

import {
  BarChartIcon, ClipboardIcon, UsersIcon,
  LogOutIcon, AirVentIcon,
} from '../../components/ui/Icons';

const ICON_ACTIVE = '#00B4D8';
const ICON_INACTIVE = '#64748B';
const BG_DARK = '#0D1B2A';

export default function AdminLayout() {
  const { logout } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: BG_DARK, height: 80 },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' as const, fontSize: 17 },
        headerShadowVisible: false,
        headerStatusBarHeight: 0,
        tabBarStyle: {
          backgroundColor: BG_DARK,
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
          position: 'relative',
        },
        tabBarActiveTintColor: ICON_ACTIVE,
        tabBarInactiveTintColor: ICON_INACTIVE,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        headerLeft: () => (
          <View style={{ marginLeft: 16, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <AirVentIcon size={20} color={ICON_ACTIVE} />
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 0.5 }}>CoolTrack</Text>
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={logout} style={{ marginRight: 16, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(239, 68, 68, 0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
            <Text style={{ color: '#EF4444', fontSize: 12, fontWeight: '600' }}>Cerrar sesión</Text>
            <LogOutIcon size={14} color="#EF4444" />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => <MinimalTabIcon focused={focused} icon={<BarChartIcon size={22} color={focused ? ICON_ACTIVE : ICON_INACTIVE} strokeWidth={focused ? 2 : 1.5} />} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Órdenes',
          tabBarIcon: ({ focused }) => <MinimalTabIcon focused={focused} icon={<ClipboardIcon size={22} color={focused ? ICON_ACTIVE : ICON_INACTIVE} strokeWidth={focused ? 2 : 1.5} />} />,
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: 'Clientes',
          tabBarIcon: ({ focused }) => <MinimalTabIcon focused={focused} icon={<UsersIcon size={22} color={focused ? ICON_ACTIVE : ICON_INACTIVE} strokeWidth={focused ? 2 : 1.5} />} />,
        }}
      />
      <Tabs.Screen name="quotes" options={{ href: null }} />
      <Tabs.Screen name="quote/new" options={{ href: null }} />
      <Tabs.Screen name="technicians" options={{ href: null }} />
      <Tabs.Screen name="create-technician" options={{ href: null }} />
      <Tabs.Screen name="client/new" options={{ href: null }} />
      <Tabs.Screen name="client/[id]" options={{ href: null }} />
      <Tabs.Screen name="client/equipment/[id]" options={{ href: null }} />
    </Tabs>
  );
}
