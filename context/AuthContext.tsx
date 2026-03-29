import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert } from 'react-native';

export type Role = 'CLIENT' | 'TECHNICIAN' | 'ADMIN' | null;

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
  login: (email: string, password?: string, mockRole?: Role) => Promise<void>;
  logout: () => void;
  updateUser: (newData: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

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

  const logout = () => {
    setRole(null);
    setUser(null);
  };

  const updateUser = (newData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...newData } : null);
  };

  return (
    <AuthContext.Provider value={{ role, user, loading, login, logout, updateUser }}>
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
