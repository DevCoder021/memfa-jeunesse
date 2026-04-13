import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('next-auth.session-token') 
    ?? request.cookies.get('__Secure-next-auth.session-token');

  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isPublicPath = request.nextUrl.pathname.startsWith('/api/auth');

  // Si pas de token et pas sur une page publique → redirige vers login
  if (!token && !isAuthPage && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si token et sur la page login → redirige vers dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};