import type { OrderStatusHistory } from '@/lib/types';
import { StatusBadge } from './status-badge';

interface TimelineProps {
  events: OrderStatusHistory[];
}

export function Timeline({ events }: TimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Sin historial de cambios
      </div>
    );
  }

  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="relative">
      {sortedEvents.map((event, index) => (
        <div key={event.id} className="flex gap-4 pb-8 last:pb-0">
          {/* Timeline Line */}
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 bg-primary rounded-full border-4 border-background relative z-10" />
            {index < sortedEvents.length - 1 && (
              <div className="w-1 h-12 bg-border mt-2" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pt-1">
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={event.status} />
              <span className="text-xs text-muted-foreground">
                {new Date(event.created_at).toLocaleDateString('es-MX')} a las{' '}
                {new Date(event.created_at).toLocaleTimeString('es-MX', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            {event.notes && (
              <p className="text-sm text-muted-foreground">{event.notes}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
