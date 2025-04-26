"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserFeed } from '@/store/slices/postSlice';
import PostList from '../../components/post/PostList';

export default function FeedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  
  const { isAuthenticated } = useAppSelector((state: any) => state.auth);
  const { userFeed, loading, error } = useAppSelector((state: any) => state.post);
  
  const mentioned = searchParams.get('mentioned') === 'true';
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // Fetch user feed with appropriate parameters
    dispatch(fetchUserFeed({
      mentioned,
      following: !mentioned,
    }));
  }, [dispatch, isAuthenticated, router, mentioned]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Sidebar */}
        <div className="hidden md:block">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Feed</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Customize your feed to see posts from people you follow or posts that mention you.
            </p>
            <Link 
              href="/create" 
              className="block w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center"
            >
              Create Post
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Feed Options</h2>
            <nav className="space-y-2">
              <Link 
                href="/feed" 
                className={`block px-3 py-2 rounded-md ${!mentioned ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                Following
              </Link>
              <Link 
                href="/feed?mentioned=true" 
                className={`block px-3 py-2 rounded-md ${mentioned ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                Mentions
              </Link>
              <Link 
                href="/" 
                className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Public Feed
              </Link>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {mentioned ? 'Posts Mentioning You' : 'Following Feed'}
              </h1>
              <div className="flex space-x-2 md:hidden">
                <Link 
                  href="/feed" 
                  className={`px-3 py-1 rounded-full text-sm ${!mentioned ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
                >
                  Following
                </Link>
                <Link 
                  href="/feed?mentioned=true" 
                  className={`px-3 py-1 rounded-full text-sm ${mentioned ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
                >
                  Mentions
                </Link>
              </div>
            </div>
            
            <PostList posts={userFeed} loading={loading} error={error} />
          </div>
        </div>
      </div>
    </div>
  );
}
