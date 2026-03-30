import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Helper multiplataforma: localStorage en web, SecureStore en nativo
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export type Role = 'client' | 'technician' | 'admin' | null;

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar_url?: string;
}

type AuthContextType = {
  role: Role;
  user: User | null;
  loading: boolean;
  checkingAuth: boolean;
  login: (email: string, password?: string, mockRole?: Role) => Promise<void>;
  logout: () => void;
  updateUser: (newData: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Cargar sesión al iniciar la aplicación
  useEffect(() => {
    async function checkPersistedAuth() {
      try {
        const storedUser = await storage.getItem('cooltrack_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setRole(parsedUser.role);
        }
      } catch (error) {
        console.error('Error loading persisted auth:', error);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkPersistedAuth();
  }, []);

  const login = async (email: string, password?: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setRole(data.user.role);
        setUser(data.user);
        
        // Guardar sesión para persistencia
        await storage.setItem('cooltrack_user', JSON.stringify(data.user));
      } else {
        Alert.alert('Error', data.error || 'Credenciales inválidas');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error de conexión', 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setRole(null);
    setUser(null);
    await storage.removeItem('cooltrack_user');
  };

  const updateUser = async (newData: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...newData };
      storage.setItem('cooltrack_user', JSON.stringify(updated)).catch(console.error);
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ role, user, loading, checkingAuth, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
