import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  className?: string;
  variant?: 'default' | 'flat' | 'accent';
}

export function Card({ children, className = '', variant = 'default', ...props }: CardProps) {
  const variantStyles: Record<string, string> = {
    default: 'bg-surface-card rounded-2xl p-4 shadow-sm border border-surface-border',
    flat:    'bg-surface-card rounded-2xl p-4 border border-surface-border',
    accent:  'bg-brand rounded-2xl p-4',
  };

  return (
    <View className={`${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </View>
  );
}
