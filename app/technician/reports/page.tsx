'use client';

import { Header } from '@/components/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import type { ServiceOrder } from '@/lib/types';

export default function TechnicianReportsPage() {
  const [completedOrders, setCompletedOrders] = useState<ServiceOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  const fetchCompletedOrders = async () => {
    try {
      const response = await fetch('/api/orders?status=completed');
      const result = await response.json();
      setCompletedOrders(result.data || []);
    } catch (error) {
      console.error('Error fetching completed orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    total: completedOrders.length,
    thisWeek: completedOrders.filter((o) => {
      const date = new Date(o.completed_at!);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }).length,
    thisMonth: completedOrders.filter((o) => {
      const date = new Date(o.completed_at!);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return date >= monthAgo;
    }).length,
    avgRating:
      completedOrders.reduce((sum, o) => sum + (o.client_rating || 0), 0) /
        completedOrders.length || 0,
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Mis Reportes</h1>
          <p className="text-muted-foreground">Análisis de órdenes completadas</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-1">Total Completadas</p>
            <p className="text-3xl font-bold text-foreground">{stats.total}</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-1">Esta Semana</p>
            <p className="text-3xl font-bold text-foreground">{stats.thisWeek}</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-1">Este Mes</p>
            <p className="text-3xl font-bold text-foreground">{stats.thisMonth}</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-1">Calificación Promedio</p>
            <p className="text-3xl font-bold text-foreground">{stats.avgRating.toFixed(1)}⭐</p>
          </Card>
        </div>

        {/* Completed Orders */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Órdenes Completadas</h2>

          {isLoading ? (
            <p className="text-muted-foreground">Cargando reportes...</p>
          ) : completedOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Sin órdenes completadas aún</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Orden</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Cliente</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Servicio</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Completada</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Calificación</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {completedOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-primary">{order.order_number}</td>
                      <td className="py-3 px-4 text-foreground text-sm">Cliente #{order.client_id.slice(0, 8)}</td>
                      <td className="py-3 px-4 text-foreground">{order.service_type}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {order.completed_at
                          ? new Date(order.completed_at).toLocaleDateString('es-MX')
                          : '-'}
                      </td>
                      <td className="py-3 px-4 text-foreground">
                        {order.client_rating ? `${order.client_rating}⭐` : '-'}
                      </td>
                      <td className="py-3 px-4 font-semibold text-foreground">
                        ${order.total_amount?.toFixed(2) || '-'}
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
