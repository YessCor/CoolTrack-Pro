'use client';

import { useSession } from 'next-auth/react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { ServiceOrder } from '@/lib/types';
import { StatusBadge } from '@/components/status-badge';
import { PriorityBadge } from '@/components/priority-badge';

export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const result = await response.json();
      setOrders(result.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return <div>Cargando...</div>;
  }

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    active: orders.filter((o) => ['assigned', 'in_transit', 'in_progress'].includes(o.status)).length,
    completed: orders.filter((o) => o.status === 'completed').length,
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mi Dashboard</h1>
            <p className="text-muted-foreground">Bienvenido, {session?.user?.name}</p>
          </div>
          <Link href="/client/new-order">
            <Button className="bg-primary hover:bg-primary/90">Nueva Solicitud</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-1">Total de Órdenes</p>
            <p className="text-3xl font-bold text-foreground">{stats.total}</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-1">Pendientes</p>
            <p className="text-3xl font-bold text-foreground">{stats.pending}</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-1">En Proceso</p>
            <p className="text-3xl font-bold text-foreground">{stats.active}</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-1">Completadas</p>
            <p className="text-3xl font-bold text-foreground">{stats.completed}</p>
          </Card>
        </div>

        {/* Orders List */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Mis Solicitudes de Servicio</h2>
          
          {isLoading ? (
            <p className="text-muted-foreground">Cargando órdenes...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No tienes solicitudes aún</p>
              <Link href="/client/new-order">
                <Button className="bg-primary hover:bg-primary/90">Crear Primera Solicitud</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Número</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Servicio</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Estado</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Prioridad</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Fecha</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">
                        <Link
                          href={`/client/orders/${order.id}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {order.order_number}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-foreground">{order.service_type}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-3 px-4">
                        <PriorityBadge priority={order.priority} />
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('es-MX')}
                      </td>
                      <td className="py-3 px-4 font-semibold text-foreground">
                        {order.total_amount ? `$${order.total_amount.toFixed(2)}` : 'Por cotizar'}
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
