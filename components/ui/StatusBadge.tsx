import { View, Text } from 'react-native';
import { OrderStatus } from '../../lib/order-status';

// StatusBadge acepta el status en minúsculas (como viene de la DB)
// o en mayúsculas (por compatibilidad). Normaliza internamente.
export type { OrderStatus };

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  pending:     { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pendiente' },
  assigned:    { bg: 'bg-cyan-100',   text: 'text-cyan-700',   label: 'Asignado' },
  accepted:    { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Aceptado' },
  in_transit:  { bg: 'bg-purple-100', text: 'text-purple-700', label: 'En Camino' },
  in_progress: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'En Progreso' },
  completed:   { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Completado' },
  cancelled:   { bg: 'bg-red-100',    text: 'text-red-700',    label: 'Cancelado' },
};

const FALLBACK = { bg: 'bg-slate-100', text: 'text-slate-500', label: 'Desconocido' };

export function StatusBadge({ status }: { status: string }) {
  const normalized = status?.toLowerCase() ?? '';
  const style = STATUS_CONFIG[normalized] ?? FALLBACK;

  return (
    <View className={`${style.bg} px-3 py-1 rounded-full self-start`}>
      <Text className={`${style.text} text-xs font-bold`}>{style.label}</Text>
    </View>
  );
}
