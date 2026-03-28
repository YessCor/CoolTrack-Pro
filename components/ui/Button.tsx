import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
}

export function Button({ title, variant = 'primary', className = '', ...props }: ButtonProps) {
  const baseStyles = 'py-4 rounded-xl items-center flex-row justify-center shadow-sm w-full';
  
  const variants = {
    primary: 'bg-primary',
    secondary: 'bg-slate-200',
    outline: 'bg-transparent border-2 border-primary',
    danger: 'bg-status-cancelled',
  };

  const textStyles = {
    primary: 'text-white font-semibold flex-1 text-center text-lg',
    secondary: 'text-slate-800 font-medium flex-1 text-center text-lg',
    outline: 'text-primary font-bold flex-1 text-center text-lg',
    danger: 'text-white font-bold flex-1 text-center text-lg',
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      <Text className={textStyles[variant]}>{title}</Text>
    </TouchableOpacity>
  );
}
