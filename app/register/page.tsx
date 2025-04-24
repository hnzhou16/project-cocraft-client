"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RegisterForm from '../../components/auth/RegisterForm';
import { useAppSelector } from '../../store/hooks';

export default function RegisterPage() {
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
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Create an Account</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
