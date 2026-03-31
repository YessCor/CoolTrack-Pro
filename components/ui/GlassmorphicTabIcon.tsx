import React, { useEffect, useRef } from 'react';
import { Animated, View, Platform, StyleSheet } from 'react-native';

interface GlassmorphicTabIconProps {
  icon: React.ReactNode;
  focused: boolean;
}

export function GlassmorphicTabIcon({ icon, focused }: GlassmorphicTabIconProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1.2,
          useNativeDriver: Platform.OS !== 'web',
          friction: 6,
          tension: 200,
        }),
        Animated.spring(translateY, {
          toValue: -4,
          useNativeDriver: Platform.OS !== 'web',
          friction: 6,
          tension: 200,
        }),
        Animated.timing(glow, {
          toValue: 1,
          duration: 250,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: Platform.OS !== 'web',
          friction: 6,
          tension: 200,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: Platform.OS !== 'web',
          friction: 6,
          tension: 200,
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
  const glowScale = glow.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] });

  return (
    <View style={styles.container}>
      {/* Glow effect behind */}
      <Animated.View
        style={[
          styles.glowRing,
          {
            opacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0, 0.3] }),
            transform: [{ scale: glowScale }],
          },
        ]}
      />
      {/* Main icon container */}
      <Animated.View
        style={[
          styles.iconWrapper,
          {
            transform: [{ scale }, { translateY }],
            backgroundColor: focused ? 'rgba(0, 180, 216, 0.15)' : 'transparent',
            borderColor: focused ? 'rgba(0, 180, 216, 0.3)' : 'transparent',
          },
        ]}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          {icon}
        </Animated.View>
      </Animated.View>
      {/* Active indicator dot */}
      <Animated.View
        style={[
          styles.indicatorDot,
          {
            opacity: bgOpacity,
            transform: [{ scale: bgOpacity }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 52,
    height: 52,
  },
  glowRing: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00B4D8',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
  },
  indicatorDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00B4D8',
  },
});
