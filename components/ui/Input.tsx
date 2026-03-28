import { View, TextInput, Text, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <View className={`mb-4 w-full ${className}`}>
      <Text className="text-sm font-semibold text-slate-700 mb-1 ml-1">{label}</Text>
      <TextInput 
        className="bg-white px-4 py-3 rounded-xl border border-slate-200 text-base shadow-sm"
        placeholderTextColor="#9ca3af"
        {...props}
      />
    </View>
  );
}
