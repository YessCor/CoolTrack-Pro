import '../global.css'; // Inicializa Tailwind/NativeWind
import { Slot, useSegments, useRootNavigationState, useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

function RootNavigationAdapter() {
  const { role } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (!rootNavigationState?.key) return;

    // Timeout manda la navegación al final del "Event Loop", 
    // previniendo conflictos de "Update during render" al presionar botones.
    const delay = setTimeout(() => {
      const inAuthGroup = segments[0] === '(auth)';

      if (!role && !inAuthGroup) {
        router.replace('/(auth)/login');
      } else if (role) {
        if (role === 'CLIENT' && segments[0] !== '(client)') {
          router.replace('/(client)');
        } else if (role === 'TECHNICIAN' && segments[0] !== '(technician)') {
          router.replace('/(technician)');
        } else if (role === 'ADMIN' && segments[0] !== '(admin)') {
          router.replace('/(admin)');
        }
      }
    }, 5);

    return () => clearTimeout(delay);
  }, [role, segments, rootNavigationState]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigationAdapter />
    </AuthProvider>
  );
}
