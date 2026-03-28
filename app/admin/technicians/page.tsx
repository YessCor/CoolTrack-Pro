'use client';

import { Header } from '@/components/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AdminTechniciansPage() {
  const [technicians, setTechnicians] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Placeholder para datos de técnicos
    setTechnicians([
      { id: '1', name: 'Carlos Mendoza', email: 'tecnico1@cooltrack.com', phone: '+52 55 8765 4321', status: 'active', orders: 5 },
      { id: '2', name: 'Ana Rodriguez', email: 'tecnico2@cooltrack.com', phone: '+52 55 9876 5432', status: 'active', orders: 3 },
    ]);
    setIsLoading(false);
  }, []);

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Técnicos</h1>
            <p className="text-muted-foreground">Gestión de técnicos y ubicaciones</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">Nuevo Técnico</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {isLoading ? (
            <p className="text-muted-foreground">Cargando técnicos...</p>
          ) : technicians.length === 0 ? (
            <p className="col-span-2 text-center py-12 text-muted-foreground">No hay técnicos registrados</p>
          ) : (
            technicians.map((tech: any) => (
              <Card key={tech.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{tech.name}</h3>
                    <p className="text-muted-foreground text-sm">{tech.email}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {tech.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  <p>📞 {tech.phone}</p>
                  <p>📋 {tech.orders} órdenes asignadas</p>
                </div>
                <Button variant="outline" className="w-full">
                  Ver Detalles
                </Button>
              </Card>
            ))
          )}
        </div>

        {/* Mapa de técnicos en tiempo real */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ubicación en Tiempo Real</h2>
          <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Mapa con ubicaciones de técnicos (Google Maps)</p>
          </div>
        </Card>
      </main>
    </>
  );
}
