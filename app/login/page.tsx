"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '../../components/auth/LoginForm';
import { useAppSelector } from '@/store/hooks';

export default function LoginPage() {
  const { isAuthenticated } = useAppSelector((state: any) => state.auth);
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if already authenticated
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Login to CoCraft</h1>
        <LoginForm />
      </div>
    </div>
  );
}
