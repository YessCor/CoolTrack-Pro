import { TouchableOpacity, Text, TouchableOpacityProps, View, ActivityIndicator } from 'react-native';
import React from 'react';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const sizeStyles: Record<string, string> = {
    sm: 'px-4 py-2',
    md: 'px-5 py-3.5',
    lg: 'px-6 py-4',
  };

  const variantStyles: Record<string, string> = {
    primary:   'bg-brand',
    secondary: 'bg-surface-hover',
    outline:   'bg-transparent border border-brand',
    danger:    'bg-status-cancelled',
    ghost:     'bg-transparent',
  };

  const textSizeStyles: Record<string, string> = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-semibold',
    lg: 'text-lg font-bold',
  };

  const textColorStyles: Record<string, string> = {
    primary:   'text-white',
    secondary: 'text-ink',
    outline:   'text-brand',
    danger:    'text-white',
    ghost:     'text-brand',
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={isDisabled}
      className={`flex-row items-center justify-center rounded-xl ${sizeStyles[size]} ${variantStyles[variant]} ${isDisabled ? 'opacity-50' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#fff' : '#0F4C75'}
          style={{ marginRight: 8 }}
        />
      ) : icon ? (
        <View style={{ marginRight: 8 }}>{icon}</View>
      ) : null}
      <Text className={`${textSizeStyles[size]} ${textColorStyles[variant]}`}>{title}</Text>
    </TouchableOpacity>
  );
}
