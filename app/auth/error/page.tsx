'use client';

import { Header } from '@/components/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = () => {
    switch (error) {
      case 'AccessDenied':
        return 'No tienes permiso para acceder a esta página.';
      case 'Callback':
        return 'Ocurrió un error en el proceso de autenticación.';
      default:
        return 'Ocurrió un error. Por favor intenta de nuevo.';
    }
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Error de Autenticación</h1>
          <p className="text-muted-foreground mb-6">{getErrorMessage()}</p>
          <Link href="/auth/login">
            <Button className="w-full bg-primary hover:bg-primary/90">Ir al Login</Button>
          </Link>
        </Card>
      </main>
    </>
  );
}
