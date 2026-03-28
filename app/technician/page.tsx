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

export default function TechnicianDashboard() {
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
    today: orders.filter((o) => {
      const today = new Date().toDateString();
      const orderDate = new Date(o.scheduled_date || o.created_at).toDateString();
      return today === orderDate && ['assigned', 'in_progress'].includes(o.status);
    }).length,
    pending: orders.filter((o) => o.status === 'assigned').length,
    inProgress: orders.filter((o) => o.status === 'in_progress').length,
    completed: orders.filter((o) => o.status === 'completed').length,
  };

  const todayOrders = orders
    .filter((o) => {
      const today = new Date().toDateString();
      const orderDate = new Date(o.scheduled_date || o.created_at).toDateString();
      return today === orderDate;
    })
    .sort((a, b) => {
      const aTime = new Date(a.scheduled_date || a.created_at).getTime();
      const bTime = new Date(b.scheduled_date || b.created_at).getTime();
      return aTime - bTime;
    });

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mi Día Laboral</h1>
            <p className="text-muted-foreground">{session?.user?.name}</p>
          </div>
        </div>

        {/* Day Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-1">Órdenes Hoy</p>
            <p className="text-3xl font-bold text-foreground">{stats.today}</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-1">Asignadas</p>
            <p className="text-3xl font-bold text-foreground">{stats.pending}</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-1">En Progreso</p>
            <p className="text-3xl font-bold text-foreground">{stats.inProgress}</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-1">Completadas</p>
            <p className="text-3xl font-bold text-foreground">{stats.completed}</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-lg font-bold text-foreground mb-2">Mi Ubicación</h3>
            <p className="text-muted-foreground text-sm mb-4">Ver tu posición en tiempo real</p>
            <Link href="/technician/location">
              <Button variant="outline" className="w-full">Ir a Ubicación</Button>
            </Link>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-lg font-bold text-foreground mb-2">Cotizaciones</h3>
            <p className="text-muted-foreground text-sm mb-4">Crear y enviar cotizaciones en campo</p>
            <Link href="/technician/quotes">
              <Button variant="outline" className="w-full">Mis Cotizaciones</Button>
            </Link>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-lg font-bold text-foreground mb-2">Reportes</h3>
            <p className="text-muted-foreground text-sm mb-4">Reportes de trabajo completado</p>
            <Link href="/technician/reports">
              <Button variant="outline" className="w-full">Ver Reportes</Button>
            </Link>
          </Card>
        </div>

        {/* Today's Orders */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Órdenes de Hoy</h2>
          
          {isLoading ? (
            <p className="text-muted-foreground">Cargando órdenes...</p>
          ) : todayOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay órdenes programadas para hoy</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayOrders.map((order) => (
                <div
                  key={order.id}
                  className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-foreground text-lg">{order.order_number}</h3>
                      <p className="text-muted-foreground text-sm">{order.service_type}</p>
                    </div>
                    <div className="flex gap-2">
                      <StatusBadge status={order.status} />
                      <PriorityBadge priority={order.priority} />
                    </div>
                  </div>
                  <p className="text-foreground mb-3">{order.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <p>📍 {order.address}</p>
                      {order.scheduled_date && (
                        <p>🕐 {new Date(order.scheduled_date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</p>
                      )}
                    </div>
                    <Link href={`/technician/orders/${order.id}`}>
                      <Button className="bg-primary hover:bg-primary/90">Ver Detalles</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* All Orders */}
        <Card className="p-6 mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Mis Órdenes</h2>
          
          {orders.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground">Sin órdenes asignadas</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Orden</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Servicio</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Estado</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Dirección</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">
                        <Link
                          href={`/technician/orders/${order.id}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {order.order_number}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-foreground">{order.service_type}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">{order.address}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {order.scheduled_date
                          ? new Date(order.scheduled_date).toLocaleDateString('es-MX')
                          : new Date(order.created_at).toLocaleDateString('es-MX')}
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
