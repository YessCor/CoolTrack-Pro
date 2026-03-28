import React from 'react';
import { View, Text, Modal as RNModal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Button } from './Button';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  primaryAction?: { label: string; onPress: () => void };
}

export function Modal({ visible, onClose, title, children, primaryAction }: ModalProps) {
  return (
    <RNModal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/50">
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View className="bg-white rounded-t-3xl p-6 min-h-[50%]">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-2xl font-bold text-slate-800">{title}</Text>
                <TouchableOpacity onPress={onClose}>
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
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}
