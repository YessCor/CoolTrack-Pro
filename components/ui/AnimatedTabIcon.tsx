import React, { useEffect, useRef } from 'react';
import { Animated, View, Platform } from 'react-native';

// Paleta de la app
// Fondo tab bar: #0D1B2A (azul marino muy oscuro)
// Activo:   fondo #1B3A5C  |  icono #00B4D8 (cian brillante)
// Inactivo: sin fondo       |  icono #6BAED6 (azul claro visible)

interface AnimatedTabIconProps {
  icon: React.ReactNode;
  focused: boolean;
}

export function AnimatedTabIcon({ icon, focused }: AnimatedTabIconProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1.18,
          useNativeDriver: Platform.OS !== 'web',
          friction: 5,
          tension: 180,
        }),
        Animated.timing(glow, {
          toValue: 1,
          duration: 200,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: Platform.OS !== 'web',
          friction: 5,
          tension: 180,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 200,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    }
  }, [focused]);

  const bgOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: 52, height: 52 }}>
      {/* Fondo animado */}
      <Animated.View
        style={{
          position: 'absolute',
          width: 48,
          height: 48,
          borderRadius: 16,
          backgroundColor: '#1B3A5C',
          opacity: bgOpacity,
          // Efecto glow en web via boxShadow
          ...(Platform.OS === 'web'
            ? { boxShadow: '0 0 12px 2px rgba(0,180,216,0.35)' }
            : {}),
        }}
      />
      {/* Ícono con escala */}
      <Animated.View style={{ transform: [{ scale }] }}>
        {icon}
      </Animated.View>
    </View>
  );
}
