"use client";

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import LoginForm from '../../components/auth/LoginForm';
import {useAppSelector} from '@/store/hooks';
import {cn, layout, typography} from "@/utils/classnames";

export default function LoginPage() {
  const {isAuthenticated} = useAppSelector(state => state.auth);
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
        <h1 className={cn(typography.h1, "text-center")}>Sign in to CoCraft</h1>
        <LoginForm/>
      </div>
    </div>
  );
}
