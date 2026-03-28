import { View, Text } from 'react-native';

export type OrderStatus = 'PENDING' | 'ASSIGNED' | 'ACCEPTED' | 'ON_THE_WAY' | 'ON_SITE' | 'IN_PROGRESS' | 'COMPLETED' | 'INVOICED';

export function StatusBadge({ status }: { status: OrderStatus | string }) {
  const config: Record<string, any> = {
    PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pendiente' },
    ASSIGNED: { bg: 'bg-cyan-100', text: 'text-cyan-700', label: 'Asignado' },
    ACCEPTED: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Aceptado' },
    ON_THE_WAY: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'En Camino' },
    ON_SITE: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'En Sitio' },
    IN_PROGRESS: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'En Progreso' },
    COMPLETED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completado' },
    INVOICED: { bg: 'bg-slate-200', text: 'text-slate-700', label: 'Facturado' },
  };

  const style = config[status] || config.PENDING;

  return (
    <View className={`${style.bg} px-3 py-1 rounded-full self-start`}>
      <Text className={`${style.text} text-xs font-bold uppercase`}>{style.label}</Text>
    </View>
  );
}
