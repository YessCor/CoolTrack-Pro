import { View, Text } from 'react-native';

export type OrderStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';

export function StatusBadge({ status }: { status: OrderStatus | string }) {
  const config: Record<string, any> = {
    PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pendiente' },
    ASSIGNED: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Asignado' },
    IN_PROGRESS: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'En Progreso' },
    COMPLETED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completado' },
  };

  const style = config[status] || config.PENDING;

  return (
    <View className={`${style.bg} px-3 py-1 rounded-full self-start`}>
      <Text className={`${style.text} text-xs font-bold uppercase`}>{style.label}</Text>
    </View>
  );
}
