"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

export default function LogoutPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  useEffect(() => {
    const performLogout = async () => {
      try {
        await dispatch(logout()).unwrap();
        router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
        // Redirect to home even if logout fails
        router.push('/');
      }
    };
    
    performLogout();
  }, [dispatch, router]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Logging out...</h1>
        <p className="text-gray-600 dark:text-gray-400">Please wait while we log you out.</p>
      </div>
    </div>
  );
}
