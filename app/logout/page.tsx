"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import {layout, typography, ui} from "@/utils/classnames";

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
    <div className={layout.container}>
      <div className="max-w-md mx-auto text-center">
        <div className={ui.busy}></div>
        <p className={typography.h3}>Logging out...</p>
        <p className={typography.p1}>Please wait while we log you out.</p>
      </div>
    </div>
  );
}
