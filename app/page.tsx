'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/login');
    } else {
      switch (session.user?.role) {
        case 'admin':
          router.push('/admin');
          break;
        case 'technician':
          router.push('/technician');
          break;
        case 'client':
          router.push('/client');
          break;
        default:
          router.push('/auth/login');
      }
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Spinner className="mx-auto mb-4" />
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    </div>
  );
}
