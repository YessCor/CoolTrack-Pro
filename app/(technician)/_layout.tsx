import { Tabs } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { TouchableOpacity, Text, View } from 'react-native';
import { ClipboardIcon, UserIcon, LogOutIcon, AirVentIcon } from '../../components/ui/Icons';
import { MinimalTabIcon } from '../../components/ui/MinimalTabIcon';

const ICON_ACTIVE = '#00B4D8';
const ICON_INACTIVE = '#64748B';
const BG_DARK = '#0D1B2A';

export default function TechnicianLayout() {
  const { logout } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: BG_DARK, height: 90 },
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
          title: 'Trabajos',
          headerTitle: 'Agenda del Día',
          tabBarIcon: ({ focused }) => (
            <MinimalTabIcon focused={focused} icon={<ClipboardIcon size={22} color={focused ? ICON_ACTIVE : ICON_INACTIVE} strokeWidth={focused ? 2 : 1.5} />} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          headerTitle: 'Mi Perfil',
          tabBarIcon: ({ focused }) => (
            <MinimalTabIcon focused={focused} icon={<UserIcon size={22} color={focused ? ICON_ACTIVE : ICON_INACTIVE} strokeWidth={focused ? 2 : 1.5} />} />
          ),
        }}
      />
      <Tabs.Screen name="job" options={{ href: null }} />
      <Tabs.Screen name="job/[id]" options={{ href: null }} />
      <Tabs.Screen name="job/quote-detail" options={{ href: null }} />
    </Tabs>
  );
}
