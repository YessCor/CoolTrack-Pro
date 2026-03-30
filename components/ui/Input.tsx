import { View, TextInput, Text, TextInputProps, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from './Icons';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
}

export function Input({ label, error, hint, leftIcon, secureTextEntry, className = '', ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = secureTextEntry;

  return (
    <View className={`mb-4 w-full ${className}`}>
      <Text className="text-xs font-bold text-ink-soft uppercase tracking-wider mb-1.5 ml-0.5">
        {label}
      </Text>
      <View className={`flex-row items-center bg-surface-card border rounded-xl overflow-hidden ${error ? 'border-status-cancelled' : 'border-surface-border'}`}>
        {leftIcon && (
          <View className="pl-4 pr-2">{leftIcon}</View>
        )}
        <TextInput
          className="flex-1 px-4 py-3.5 text-base text-ink"
          placeholderTextColor="#94a3b8"
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="pr-4 pl-2"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {showPassword
              ? <EyeOffIcon size={18} color="#94a3b8" />
              : <EyeIcon size={18} color="#94a3b8" />
            }
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <Text className="text-status-cancelled text-xs mt-1 ml-0.5">{error}</Text>
      ) : hint ? (
        <Text className="text-slate-400 text-xs mt-1 ml-0.5">{hint}</Text>
      ) : null}
    </View>
  );
}
