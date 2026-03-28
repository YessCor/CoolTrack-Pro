import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/auth/login', '/auth/register', '/auth/forgot-password'];
const adminPaths = ['/admin'];
const technicianPaths = ['/technician'];
const clientPaths = ['/client'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get session
  const session = await auth();

  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Check role-based access
  if (adminPaths.some((path) => pathname.startsWith(path))) {
    if (session.user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  if (technicianPaths.some((path) => pathname.startsWith(path))) {
    if (session.user?.role !== 'technician') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  if (clientPaths.some((path) => pathname.startsWith(path))) {
    if (session.user?.role !== 'client') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.svg).*)'],
};
