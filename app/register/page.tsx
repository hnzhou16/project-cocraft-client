"use client";

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import RegisterForm from "@/components/auth/RegisterForm";
import {useAppSelector} from '@/store/hooks';
import {layout, typography} from "@/utils/classnames";

export default function RegisterPage() {
  const {isAuthenticated} = useAppSelector((state: any) => state.auth);
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if already authenticated
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <div className={layout.container}>
      <div className="max-w-md mx-auto">
        {/*<p className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Create an Account</p>*/}
        <p className={typography.h1}>Create an Account</p>
        <RegisterForm/>
      </div>
    </div>
  );
}
