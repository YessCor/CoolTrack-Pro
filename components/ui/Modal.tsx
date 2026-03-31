import React from 'react';
import { View, Text, Modal as RNModal, TouchableOpacity, TouchableWithoutFeedback, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from './Button';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  primaryAction?: { label: string; onPress: () => void };
  position?: 'bottom' | 'center';
}

export function Modal({ visible, onClose, title, children, primaryAction, position = 'bottom' }: ModalProps) {
  const insets = useSafeAreaInsets();
  const isCenter = position === 'center';
  
  return (
    <RNModal 
      transparent 
      visible={visible} 
      animationType={isCenter ? 'fade' : 'slide'} 
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.overlay, isCenter && styles.overlayCenter]}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            {isCenter ? (
              <View style={styles.centerContainer}>
                <View style={styles.centerCard}>
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-xl font-bold text-slate-800">{title}</Text>
                    <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Text className="text-slate-400 font-bold text-xl">✕</Text>
                    </TouchableOpacity>
                  </View>
                  <View className="mb-4">
                    {children}
                  </View>
                  {primaryAction && (
                    <Button title={primaryAction.label} onPress={primaryAction.onPress} className="w-full" />
                  )}
                </View>
              </View>
            ) : (
              <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16), paddingTop: Math.max(insets.top, 20) }]}>
                <View className="bg-white rounded-t-3xl p-6 min-h-[50%] flex-1">
                  <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-2xl font-bold text-slate-800">{title}</Text>
                    <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Text className="text-slate-400 font-bold text-xl">✕</Text>
                    </TouchableOpacity>
                  </View>
                  <View className="flex-1">
                    {children}
                  </View>
                  {primaryAction && (
                    <View className="mt-6 pt-4 border-t border-slate-100">
                      <Button title={primaryAction.label} onPress={primaryAction.onPress} />
                    </View>
                  )}
                </View>
              </View>
            )}
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(13,27,42,0.75)',
    justifyContent: 'flex-end',
  },
  overlayCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'transparent',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  centerCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 32,
    width: '100%',
    maxWidth: 400,
  },
});
