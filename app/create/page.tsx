"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import CreatePostForm from '../../components/post/CreatePostForm';
import {cn, layout, typography} from "@/utils/classnames";

export default function CreatePostPage() {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);
  
  return (
    <div className={layout.container}>
      <div className="max-w-2xl mx-auto">
        <h1 className={cn(typography.h1, "text-center")}>Create a New Post</h1>
        <CreatePostForm />
      </div>
    </div>
  );
}
