'use client';

import { Header } from '@/components/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { ServiceOrder } from '@/lib/types';
import { StatusBadge } from '@/components/status-badge';
import { PriorityBadge } from '@/components/priority-badge';
import { useRouter } from 'next/navigation';

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const url = statusFilter
        ? `/api/orders?status=${statusFilter}`
        : '/api/orders';
      const response = await fetch(url);
      const result = await response.json();
      setOrders(result.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statuses = ['pending', 'assigned', 'in_transit', 'in_progress', 'completed', 'cancelled'];

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Órdenes de Servicio</h1>
            <p className="text-muted-foreground">Gestión de todas las órdenes</p>
          </div>
          <Link href="/admin/orders/new">
            <Button className="bg-primary hover:bg-primary/90">Nueva Orden</Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={statusFilter === '' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('')}
              className={statusFilter === '' ? 'bg-primary hover:bg-primary/90' : ''}
            >
              Todas ({orders.length})
            </Button>
            {statuses.map((status) => {
              const count = orders.filter((o) => o.status === status).length;
              return (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  onClick={() => setStatusFilter(status)}
                  className={statusFilter === status ? 'bg-primary hover:bg-primary/90' : ''}
                >
                  {status.replace('_', ' ')} ({count})
                </Button>
              );
            })}
          </div>
        </Card>

        {/* Orders Table */}
        <Card className="p-6">
          {isLoading ? (
            <p className="text-muted-foreground">Cargando órdenes...</p>
          ) : orders.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground">No hay órdenes para mostrar</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Orden</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Cliente</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Técnico</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Servicio</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Estado</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Prioridad</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Monto</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-medium text-primary">{order.order_number}</span>
                      </td>
                      <td className="py-3 px-4 text-foreground text-sm">Cliente #{order.client_id.slice(0, 8)}</td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">
                        {order.technician_id ? 'Asignado' : 'Sin asignar'}
                      </td>
                      <td className="py-3 px-4 text-foreground">{order.service_type}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-3 px-4">
                        <PriorityBadge priority={order.priority} />
                      </td>
                      <td className="py-3 px-4 font-semibold text-foreground">
                        {order.total_amount ? `$${order.total_amount.toFixed(2)}` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/admin/orders/${order.id}`)}
                        >
                          Ver
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </>
  );
}
