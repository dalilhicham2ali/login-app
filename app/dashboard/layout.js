'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuthStatus } from '@/lib/auth';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const { isAuthenticated } = await checkAuthStatus();
        setIsAuthenticated(isAuthenticated);
        if (!isAuthenticated) {
          router.replace('/login');
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        router.replace('/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Ne rendre le contenu que si l'utilisateur est authentifié
  return isAuthenticated ? children : null;
}