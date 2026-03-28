import { View, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ListItemProps extends TouchableOpacityProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  icon?: string;
}

export function ListItem({ title, subtitle, rightElement, icon, ...props }: ListItemProps) {
  return (
    <TouchableOpacity 
      className="flex-row items-center bg-white p-4 border-b border-slate-100"
      activeOpacity={0.7}
      {...props}
    >
      {icon && (
        <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-3">
          <Text className="text-xl">{icon}</Text>
        </View>
      )}
      <View className="flex-1">
        <Text className="text-slate-800 font-bold text-base">{title}</Text>
        {subtitle && <Text className="text-slate-500 text-sm mt-1">{subtitle}</Text>}
      </View>
      {rightElement && <View>{rightElement}</View>}
    </TouchableOpacity>
  );
}
