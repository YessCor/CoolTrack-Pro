import { Tabs } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { TouchableOpacity, View, Text, Platform } from 'react-native';
import { AnimatedTabIcon } from '../../components/ui/AnimatedTabIcon';

import {
  BarChartIcon, ClipboardIcon, UsersIcon,
  LogOutIcon, AirVentIcon, FileTextIcon, WrenchIcon,
} from '../../components/ui/Icons';

// Colores de la paleta
const ICON_ACTIVE = '#00B4D8';   // cian brillante
const ICON_INACTIVE = '#6BAED6'; // azul claro visible

export default function AdminLayout() {
  const { logout } = useAuth();

  const screenOptions = {
    headerStyle: { backgroundColor: '#0D1B2A' },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: '700' as const, fontSize: 17, letterSpacing: 0.3 },
    headerShadowVisible: false,
    tabBarStyle: {
      backgroundColor: '#0D1B2A',
      borderTopWidth: 0,
      height: Platform.OS === 'ios' ? 85 : 68,
      paddingBottom: Platform.OS === 'ios' ? 24 : 10,
      paddingTop: 8,
      elevation: 0,
      
    },
    tabBarActiveTintColor: ICON_ACTIVE,
    tabBarInactiveTintColor: ICON_INACTIVE,
    tabBarLabelStyle: { fontSize: 10, fontWeight: '600' as const, letterSpacing: 0.5, marginTop: 2 },
    headerLeft: () => (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 16, gap: 8 }}>
        <AirVentIcon size={20} color="#00B4D8" />
        <Text style={{ color: '#00B4D8', fontWeight: '800', fontSize: 14, letterSpacing: 1 }}>COOLTRACK</Text>
      </View>
    ),
    headerRight: () => (
      <TouchableOpacity onPress={logout} style={{ marginRight: 16 }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <LogOutIcon size={18} color="#EF4444" />
      </TouchableOpacity>
    ),
  };

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard', headerTitle: 'Panel General',
          tabBarIcon: ({ focused }) => <AnimatedTabIcon focused={focused} icon={<BarChartIcon size={22} color={focused ? ICON_ACTIVE : ICON_INACTIVE} strokeWidth={focused ? 2.2 : 1.6} />} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Ã“rdenes', headerTitle: 'Monitor de Operaciones',
          tabBarIcon: ({ focused }) => <AnimatedTabIcon focused={focused} icon={<ClipboardIcon size={22} color={focused ? ICON_ACTIVE : ICON_INACTIVE} strokeWidth={focused ? 2.2 : 1.6} />} />,
        }}
      />
      <Tabs.Screen
        name="quotes"
        options={{
          title: 'Cotizaciones', headerTitle: 'GestiÃ³n Comercial',
          tabBarIcon: ({ focused }) => <AnimatedTabIcon focused={focused} icon={<FileTextIcon size={22} color={focused ? ICON_ACTIVE : ICON_INACTIVE} strokeWidth={focused ? 2.2 : 1.6} />} />,
        }}
      />
      <Tabs.Screen
        name="technicians"
        options={{
          title: 'Staff', headerTitle: 'Directorio de TÃ©cnicos',
          tabBarIcon: ({ focused }) => <AnimatedTabIcon focused={focused} icon={<WrenchIcon size={22} color={focused ? ICON_ACTIVE : ICON_INACTIVE} strokeWidth={focused ? 2.2 : 1.6} />} />,
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: 'Clientes', headerTitle: 'Base de Clientes',
          tabBarIcon: ({ focused }) => <AnimatedTabIcon focused={focused} icon={<UsersIcon size={22} color={focused ? ICON_ACTIVE : ICON_INACTIVE} strokeWidth={focused ? 2.2 : 1.6} />} />,
        }}
      />
      <Tabs.Screen
        name="equipment"
        options={{
          title: 'Equipos', headerTitle: 'GestiÃ³n de Equipos',
          tabBarIcon: ({ focused }) => <AnimatedTabIcon focused={focused} icon={<AirVentIcon size={22} color={focused ? ICON_ACTIVE : ICON_INACTIVE} strokeWidth={focused ? 2.2 : 1.6} />} />,
        }}
      />
      <Tabs.Screen
        name="create-technician"
        options={{ href: null }}
      />
      <Tabs.Screen name="client" options={{ href: null }} />
      <Tabs.Screen name="quote" options={{ href: null }} />
    </Tabs>
  );
}
