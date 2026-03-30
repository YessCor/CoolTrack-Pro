import { Tabs } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { TouchableOpacity, View, Text, Platform } from 'react-native';
import {
  BarChartIcon, ClipboardIcon, UsersIcon,
  LogOutIcon, AirVentIcon, FileTextIcon, WrenchIcon,
} from '../../components/ui/Icons';

function TabIcon({ icon, focused }: { icon: React.ReactNode; focused: boolean }) {
  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: focused ? '#0F4C75' : 'transparent',
    }}>
      {icon}
    </View>
  );
}

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
      shadowOpacity: 0,
    },
    tabBarActiveTintColor: '#FFFFFF',
    tabBarInactiveTintColor: '#4A6785',
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
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={<BarChartIcon size={20} color={focused ? '#fff' : '#4A6785'} />} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Órdenes', headerTitle: 'Monitor de Operaciones',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={<ClipboardIcon size={20} color={focused ? '#fff' : '#4A6785'} />} />,
        }}
      />
      <Tabs.Screen
        name="quotes"
        options={{
          title: 'Cotizaciones', headerTitle: 'Gestión Comercial',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={<FileTextIcon size={20} color={focused ? '#fff' : '#4A6785'} />} />,
        }}
      />
      <Tabs.Screen
        name="technicians"
        options={{
          title: 'Staff', headerTitle: 'Directorio de Técnicos',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={<WrenchIcon size={20} color={focused ? '#fff' : '#4A6785'} />} />,
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: 'Clientes', headerTitle: 'Base de Clientes',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={<UsersIcon size={20} color={focused ? '#fff' : '#4A6785'} />} />,
        }}
      />
      <Tabs.Screen
        name="create-technician"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
