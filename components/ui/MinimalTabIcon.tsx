import React from 'react';
import { View, StyleSheet } from 'react-native';

interface MinimalTabIconProps {
  icon: React.ReactNode;
  focused: boolean;
}

export function MinimalTabIcon({ icon, focused }: MinimalTabIconProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
        {icon}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperActive: {
    paddingVertical: 4,
  },
});
