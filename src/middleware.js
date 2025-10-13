// src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Static files and API auth routes - always allow
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Public routes (landing page, login, signup)
  const publicRoutes = ['/', '/login', '/signup'];
  
  // Protected routes (dashboard and all app pages)
  const protectedRoutes = ['/dashboard', '/patients', '/appointments', '/inventory', '/prescriptions', '/invoices'];

  // Check if route is public
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // For API routes (except auth), check for authorization header
  if (pathname.startsWith('/api/')) {
    const token = request.headers.get('authorization');
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // For protected routes, we'll handle auth check on client side
  // Just let them through and check in the page component
  if (isProtectedRoute || isPublicRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};