"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../store/hooks';
import CreatePostForm from '../../components/post/CreatePostForm';

export default function CreatePostPage() {
  const { isAuthenticated } = useAppSelector((state: any) => state.auth);
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Create a New Post</h1>
        <CreatePostForm />
      </div>
    </div>
  );
}
