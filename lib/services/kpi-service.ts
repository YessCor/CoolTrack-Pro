import { getAllWorkOrders } from '../repositories/work-order-repository';
import { getAllClients } from '../repositories/client-repository';
import { getAllQuotes } from '../repositories/quote-repository';
import { ORDER_STATUS } from '../order-status';

export type TimeRange = 'today' | 'week' | 'month' | 'year';

export interface KPIData {
  servicesCompleted: number;
  preventiveCount: number;
  correctiveCount: number;
  activeTechnicians: number;
  totalRevenue: number;
  pendingOrders: number;
  inProgressOrders: number;
  completedOrders: number;
}

function getDateRange(range: TimeRange): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date();
  const end = new Date();

  switch (range) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week':
      const dayOfWeek = now.getDay();
      start.setDate(now.getDate() - dayOfWeek);
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'year':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;
  }

  return { start, end };
}

export async function calculateKPIs(range: TimeRange): Promise<KPIData> {
  const [orders, clients, quotes] = await Promise.all([
    getAllWorkOrders(),
    getAllClients(),
    getAllQuotes(),
  ]);

  const { start, end } = getDateRange(range);

  const completedOrders = orders.filter(o => {
    if (o.status !== ORDER_STATUS.COMPLETED || !o.completed_at) return false;
    const completedDate = new Date(o.completed_at);
    return completedDate >= start && completedDate <= end;
  });

  const preventiveCount = completedOrders.filter(o => o.service_type === 'preventivo').length;
  const correctiveCount = completedOrders.filter(o => o.service_type === 'correctivo').length;

  const pendingOrders = orders.filter(o => 
    o.status === ORDER_STATUS.PENDING || o.status === ORDER_STATUS.ASSIGNED
  ).length;

  const inProgressOrders = orders.filter(o => 
    o.status === ORDER_STATUS.ACCEPTED ||
    o.status === ORDER_STATUS.IN_TRANSIT ||
    o.status === ORDER_STATUS.IN_PROGRESS
  ).length;

  const activeTechnicianIds = new Set(
    orders
      .filter(o => 
        o.technician_id && (
          o.status === ORDER_STATUS.IN_PROGRESS ||
          o.status === ORDER_STATUS.ACCEPTED ||
          o.status === ORDER_STATUS.IN_TRANSIT
        )
      )
      .map(o => o.technician_id)
  );

  const approvedQuotes = quotes.filter(q => {
    if (q.status !== 'approved' || !q.email_sent_at) return false;
    const sentDate = new Date(q.email_sent_at);
    return sentDate >= start && sentDate <= end;
  });

  const totalRevenue = approvedQuotes.reduce((sum, q) => sum + (q.total || 0), 0);

  return {
    servicesCompleted: completedOrders.length,
    preventiveCount,
    correctiveCount,
    activeTechnicians: activeTechnicianIds.size,
    totalRevenue,
    pendingOrders,
    inProgressOrders,
    completedOrders: completedOrders.length,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
}
