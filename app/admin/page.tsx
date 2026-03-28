'use client';

import { useSession } from 'next-auth/react';
import { Header } from '@/components/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { ServiceOrder } from '@/lib/types';
import { StatusBadge } from '@/components/status-badge';
import { PriorityBadge } from '@/components/priority-badge';

export default function AdminDashboard() {
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

  const totalRevenue = orders
    .filter((o) => o.status === 'completed' && o.total_amount)
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Panel Administrativo</h1>
            <p className="text-muted-foreground">Gestión integral del sistema</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/orders/new">
              <Button className="bg-primary hover:bg-primary/90">Nueva Orden</Button>
            </Link>
          </div>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 border-l-4 border-primary">
            <p className="text-muted-foreground text-sm mb-1">Total Órdenes</p>
            <p className="text-3xl font-bold text-foreground">{stats.total}</p>
            <p className="text-xs text-muted-foreground mt-2">{stats.pending} pendientes</p>
          </Card>
          <Card className="p-6 border-l-4 border-secondary">
            <p className="text-muted-foreground text-sm mb-1">En Proceso</p>
            <p className="text-3xl font-bold text-foreground">{stats.active}</p>
            <p className="text-xs text-muted-foreground mt-2">órdenes activas</p>
          </Card>
          <Card className="p-6 border-l-4 border-success">
            <p className="text-muted-foreground text-sm mb-1">Completadas</p>
            <p className="text-3xl font-bold text-foreground">{stats.completed}</p>
            <p className="text-xs text-muted-foreground mt-2">este período</p>
          </Card>
          <Card className="p-6 border-l-4 border-info">
            <p className="text-muted-foreground text-sm mb-1">Ingresos</p>
            <p className="text-3xl font-bold text-foreground">${totalRevenue.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground mt-2">órdenes completadas</p>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-lg font-bold text-foreground mb-2">Órdenes de Servicio</h3>
            <p className="text-muted-foreground text-sm mb-4">Gestión de todas las órdenes y asignaciones</p>
            <Link href="/admin/orders">
              <Button variant="outline" className="w-full">Ir a Órdenes</Button>
            </Link>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-lg font-bold text-foreground mb-2">Técnicos</h3>
            <p className="text-muted-foreground text-sm mb-4">Gestión de técnicos y ubicaciones en tiempo real</p>
            <Link href="/admin/technicians">
              <Button variant="outline" className="w-full">Ir a Técnicos</Button>
            </Link>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-lg font-bold text-foreground mb-2">Clientes</h3>
            <p className="text-muted-foreground text-sm mb-4">Gestión de clientes y equipos registrados</p>
            <Link href="/admin/clients">
              <Button variant="outline" className="w-full">Ir a Clientes</Button>
            </Link>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Órdenes Recientes</h2>
          
          {isLoading ? (
            <p className="text-muted-foreground">Cargando órdenes...</p>
          ) : orders.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground">No hay órdenes registradas</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Orden</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Cliente</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Técnico</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Estado</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Prioridad</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {order.order_number}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-foreground">Orden #{order.id.slice(0, 8)}</td>
                      <td className="py-3 px-4 text-muted-foreground">{order.technician_id ? 'Asignado' : 'Sin asignar'}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-3 px-4">
                        <PriorityBadge priority={order.priority} />
                      </td>
                      <td className="py-3 px-4 font-semibold text-foreground">
                        {order.total_amount ? `$${order.total_amount.toFixed(2)}` : '-'}
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
