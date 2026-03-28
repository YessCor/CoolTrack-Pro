'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  const getDashboardLink = () => {
    if (!session?.user) return '/';
    switch (session.user.role) {
      case 'admin':
        return '/admin';
      case 'technician':
        return '/technician';
      case 'client':
        return '/client';
      default:
        return '/';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={getDashboardLink()} className="flex items-center gap-2 font-bold text-xl hover:opacity-90">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold">CT</span>
          </div>
          <span>CoolTrack Pro</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {status === 'authenticated' && (
            <>
              <span className="text-sm opacity-90">{session?.user?.name}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90">
                    Menú
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push(getDashboardLink())}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          {status !== 'authenticated' && (
            <Link href="/auth/login">
              <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary/90">
                Ingresar
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
