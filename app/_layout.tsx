import '../global.css'; // Inicializa Tailwind/NativeWind
import { Slot, useSegments, useRootNavigationState, useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

function RootNavigationAdapter() {
  const { role, checkingAuth } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    // Evitar navegación si no se ha cargado el estado de navegación o se está verificando autenticación
    if (!rootNavigationState?.key || checkingAuth) return;

    // Timeout manda la navegación al final del "Event Loop", 
    // previniendo conflictos de "Update during render" al presionar botones.
    const delay = setTimeout(() => {
      const inAuthGroup = segments[0] === '(auth)';

      if (!role && !inAuthGroup) {
        router.replace('/(auth)/login');
      } else if (role) {
        if (role === 'client' && segments[0] !== '(client)') {
          router.replace('/(client)');
        } else if (role === 'technician' && segments[0] !== '(technician)') {
          router.replace('/(technician)');
        } else if (role === 'admin' && segments[0] !== '(admin)') {
          router.replace('/(admin)');
        }
      }
    }, 5);

    return () => clearTimeout(delay);
  }, [role, segments, rootNavigationState, checkingAuth]);

  // Pantalla de carga mientras lee AsyncStorage
  if (checkingAuth) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0D1B2A', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#00B4D8" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigationAdapter />
    </AuthProvider>
  );
}
