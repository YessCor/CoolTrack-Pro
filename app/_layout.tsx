import '../global.css'; // Inicializa Tailwind/NativeWind
import { Slot, useSegments, useRootNavigationState, Redirect } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';

function RootNavigationAdapter() {
  const { role } = useAuth();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();

  if (!rootNavigationState?.key) {
    return <Slot />;
  }

  const inAuthGroup = segments[0] === '(auth)';

  if (!role && !inAuthGroup) {
    return <Redirect href="/(auth)/login" />;
  } 
  
  if (role) {
    if (role === 'CLIENT' && segments[0] !== '(client)') {
      return <Redirect href="/(client)" />;
    }
    if (role === 'TECHNICIAN' && segments[0] !== '(technician)') {
      return <Redirect href="/(technician)" />;
    }
    if (role === 'ADMIN' && segments[0] !== '(admin)') {
      return <Redirect href="/(admin)" />;
    }
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
