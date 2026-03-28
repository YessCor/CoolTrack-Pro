'use client';

import { Header } from '@/components/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { Quote } from '@/lib/types';

export default function TechnicianQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      // Placeholder - en producción traerías desde la API
      setQuotes([]);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quotesByStatus = {
    draft: quotes.filter((q) => q.status === 'draft'),
    sent: quotes.filter((q) => q.status === 'sent'),
    approved: quotes.filter((q) => q.status === 'approved'),
    rejected: quotes.filter((q) => q.status === 'rejected'),
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mis Cotizaciones</h1>
            <p className="text-muted-foreground">Crear y gestionar cotizaciones en campo</p>
          </div>
          <Link href="/technician/quotes/new">
            <Button className="bg-primary hover:bg-primary/90">Nueva Cotización</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <p className="text-muted-foreground text-sm">Total</p>
            <p className="text-2xl font-bold text-foreground">{quotes.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-muted-foreground text-sm">Borrador</p>
            <p className="text-2xl font-bold text-foreground">{quotesByStatus.draft.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-muted-foreground text-sm">Enviadas</p>
            <p className="text-2xl font-bold text-foreground">{quotesByStatus.sent.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-muted-foreground text-sm">Aprobadas</p>
            <p className="text-2xl font-bold text-foreground">{quotesByStatus.approved.length}</p>
          </Card>
        </div>

        {/* Quotes by Status */}
        <div className="space-y-8">
          {Object.entries(quotesByStatus).map(([status, statusQuotes]) => (
            <Card key={status} className="p-6">
              <h3 className="font-bold text-lg text-foreground mb-4 capitalize">
                {status === 'draft' && 'Borradores'}
                {status === 'sent' && 'Enviadas'}
                {status === 'approved' && 'Aprobadas'}
                {status === 'rejected' && 'Rechazadas'}
              </h3>

              {statusQuotes.length === 0 ? (
                <p className="text-muted-foreground">No hay cotizaciones en este estado</p>
              ) : (
                <div className="space-y-3">
                  {statusQuotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">{quote.quote_number}</h4>
                          <p className="text-sm text-muted-foreground">
                            Total: ${quote.total.toFixed(2)}
                          </p>
                        </div>
                        <Link href={`/technician/quotes/${quote.id}`}>
                          <Button size="sm" variant="outline">
                            Ver
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
