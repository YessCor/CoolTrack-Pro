'use client';

import { Header } from '@/components/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function AdminClientsPage() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Placeholder para datos de clientes
    setClients([
      { id: '1', name: 'Juan Garcia', email: 'cliente1@example.com', phone: '+52 55 1111 2222', equipment: 2, orders: 4 },
      { id: '2', name: 'Maria Lopez', email: 'cliente2@example.com', phone: '+52 55 3333 4444', equipment: 1, orders: 2 },
    ]);
    setIsLoading(false);
  }, []);

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
            <p className="text-muted-foreground">Gestión de clientes y equipos</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">Nuevo Cliente</Button>
        </div>

        <Card className="p-6">
          {isLoading ? (
            <p className="text-muted-foreground">Cargando clientes...</p>
          ) : clients.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground">No hay clientes registrados</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Nombre</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Teléfono</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Equipos</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Órdenes</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client: any) => (
                    <tr key={client.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-foreground">{client.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{client.email}</td>
                      <td className="py-3 px-4 text-muted-foreground">{client.phone}</td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                          {client.equipment}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          {client.orders}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline">Ver</Button>
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
