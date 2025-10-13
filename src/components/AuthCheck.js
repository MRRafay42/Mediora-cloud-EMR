// src/components/AuthCheck.js
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthCheck({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Protected routes that require authentication
    const protectedRoutes = ['/dashboard', '/patients', '/appointments', '/inventory', '/prescriptions', '/invoices'];
    
    // Auth routes that logged-in users shouldn't access
    const authRoutes = ['/login', '/signup'];
    
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.includes(pathname);

    // If trying to access protected route without token, redirect to login
    if (isProtectedRoute && !token) {
      router.push('/login');
      return;
    }

    // If trying to access login/signup with valid token, redirect to dashboard
    if (isAuthRoute && token) {
      router.push('/dashboard');
      return;
    }
  }, [pathname, router]);

  return children;
}