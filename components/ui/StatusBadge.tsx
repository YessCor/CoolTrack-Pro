import { View, Text } from 'react-native';
import { OrderStatus } from '../../lib/order-status';

export type { OrderStatus };

// Normaliza mayúsculas/minúsculas y alias legacy (ON_THE_WAY → in_transit)
const ALIAS: Record<string, string> = {
  on_the_way: 'in_transit',
  on_site: 'in_progress',
  invoiced: 'completed',
};

const STATUS_CONFIG: Record<string, { dot: string; dotColor: string; bg: string; text: string; label: string }> = {
  pending:     { dot: '#F59E0B', dotColor: '#F59E0B', bg: '#FFFBEB', text: '#B45309', label: 'Pendiente'   },
  assigned:    { dot: '#06B6D4', dotColor: '#06B6D4', bg: '#ECFEFF', text: '#0E7490', label: 'Asignado'    },
  accepted:    { dot: '#3B82F6', dotColor: '#3B82F6', bg: '#EFF6FF', text: '#1D4ED8', label: 'Aceptado'    },
  in_transit:  { dot: '#8B5CF6', dotColor: '#8B5CF6', bg: '#F5F3FF', text: '#6D28D9', label: 'En Camino'   },
  in_progress: { dot: '#6366F1', dotColor: '#6366F1', bg: '#EEF2FF', text: '#4338CA', label: 'En Progreso' },
  completed:   { dot: '#10B981', dotColor: '#10B981', bg: '#ECFDF5', text: '#047857', label: 'Completado'  },
  cancelled:   { dot: '#EF4444', dotColor: '#EF4444', bg: '#FEF2F2', text: '#B91C1C', label: 'Cancelado'   },
};

const FALLBACK = { dot: '#94a3b8', dotColor: '#94a3b8', bg: '#F1F5F9', text: '#475569', label: 'Desconocido' };

export function StatusBadge({ status }: { status: string }) {
  const normalized = ALIAS[status?.toLowerCase()] ?? status?.toLowerCase() ?? '';
  const style = STATUS_CONFIG[normalized] ?? FALLBACK;

  return (
    <View style={{ backgroundColor: style.bg, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, alignSelf: 'flex-start', gap: 6 }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: style.dot }} />
      <Text style={{ color: style.text, fontSize: 11, fontWeight: '700', letterSpacing: 0.3 }}>{style.label}</Text>
    </View>
  );
}
