const priorityConfig: Record<string, { label: string; className: string }> = {
  low: { label: 'Baja', className: 'bg-blue-100 text-blue-800' },
  normal: { label: 'Normal', className: 'bg-gray-100 text-gray-800' },
  urgent: { label: 'Urgente', className: 'bg-orange-100 text-orange-800' },
  emergency: { label: 'Emergencia', className: 'bg-red-100 text-red-800' },
};

interface PriorityBadgeProps {
  priority: string;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority] || priorityConfig.normal;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
