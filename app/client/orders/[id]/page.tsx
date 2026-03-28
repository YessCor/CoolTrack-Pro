'use client';

import { Header } from '@/components/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { ServiceOrder } from '@/lib/types';
import { StatusBadge } from '@/components/status-badge';
import { PriorityBadge } from '@/components/priority-badge';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<ServiceOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Placeholder - En producción, aquí traerías los datos de la API
    setIsLoading(false);
  }, [params.id]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!order) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground">Orden no encontrada</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => router.push('/client')}
        >
          ← Volver
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="md:col-span-2">
            <Card className="p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{order.order_number}</h1>
                  <p className="text-muted-foreground">{order.service_type}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <StatusBadge status={order.status} />
                  <PriorityBadge priority={order.priority} />
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-semibold text-foreground mb-2">Descripción</h3>
                <p className="text-muted-foreground">{order.description}</p>
              </div>

              <div className="border-t border-border pt-4 mt-4">
                <h3 className="font-semibold text-foreground mb-2">Dirección</h3>
                <p className="text-muted-foreground">{order.address}</p>
              </div>
            </Card>

            {order.technician_notes && (
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-2">Notas del Técnico</h3>
                <p className="text-muted-foreground">{order.technician_notes}</p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Información</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">Creada</p>
                  <p className="text-foreground">
                    {new Date(order.created_at).toLocaleDateString('es-MX')}
                  </p>
                </div>
                {order.scheduled_date && (
                  <div>
                    <p className="text-xs text-muted-foreground">Programada</p>
                    <p className="text-foreground">
                      {new Date(order.scheduled_date).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                )}
                {order.total_amount && (
                  <div className="border-t border-border pt-4">
                    <p className="text-xs text-muted-foreground">Monto</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${order.total_amount.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
