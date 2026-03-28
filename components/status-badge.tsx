import type { OrderStatus } from '@/lib/types';

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: 'Pendiente', className: 'badge-pending' },
  assigned: { label: 'Asignada', className: 'badge-assigned' },
  in_transit: { label: 'En Transito', className: 'badge-in-transit' },
  in_progress: { label: 'En Progreso', className: 'badge-in-progress' },
  completed: { label: 'Completada', className: 'badge-completed' },
  cancelled: { label: 'Cancelada', className: 'badge-cancelled' },
};

interface StatusBadgeProps {
  status: OrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  if (!config) {
    return <span className={`badge-status bg-gray-100 text-gray-800`}>{status}</span>;
  }

  return <span className={config.className}>{config.label}</span>;
}
