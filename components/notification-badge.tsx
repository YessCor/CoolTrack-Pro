import type { Notification } from '@/lib/types';
import { X } from 'lucide-react';

const typeColors = {
  order: 'bg-blue-100 text-blue-800',
  quote: 'bg-purple-100 text-purple-800',
  info: 'bg-gray-100 text-gray-800',
  alert: 'bg-red-100 text-red-800',
};

interface NotificationBadgeProps {
  notification: Notification;
  onDismiss?: () => void;
}

export function NotificationBadge({
  notification,
  onDismiss,
}: NotificationBadgeProps) {
  return (
    <div className={`p-4 rounded-lg flex items-start gap-3 ${typeColors[notification.type]}`}>
      <div className="flex-1">
        <h4 className="font-semibold text-sm">{notification.title}</h4>
        <p className="text-sm mt-1">{notification.message}</p>
        <p className="text-xs mt-2 opacity-70">
          {new Date(notification.created_at).toLocaleDateString('es-MX')}
        </p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
