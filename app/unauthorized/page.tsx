'use client';

import { Header } from '@/components/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Acceso Denegado</h1>
          <p className="text-muted-foreground mb-6">
            No tienes permiso para acceder a esta página. Verifica tu rol de usuario.
          </p>
          <Button
            className="w-full bg-primary hover:bg-primary/90"
            onClick={() => router.push('/')}
          >
            Volver al Inicio
          </Button>
        </Card>
      </main>
    </>
  );
}
