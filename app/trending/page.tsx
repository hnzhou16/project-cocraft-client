"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPublicFeed } from '../../store/slices/postSlice';
import PostList from '../../components/post/PostList';
import { PostWithLikeStatus } from '../../types';

export default function TrendingPage() {
  const dispatch = useAppDispatch();
  const { publicFeed, loading, error } = useAppSelector((state: any) => state.post);
  
  const [sortBy, setSortBy] = useState<string>('likes');
  
  useEffect(() => {
    dispatch(fetchPublicFeed());
  }, [dispatch]);
  
  // Sort posts based on selected criteria
  const sortedPosts = [...(publicFeed || [])].sort((a: PostWithLikeStatus, b: PostWithLikeStatus) => {
    if (sortBy === 'likes') {
      return b.post.like_count - a.post.like_count;
    } else if (sortBy === 'comments') {
      return b.post.comment_count - a.post.comment_count;
    } else if (sortBy === 'newest') {
      return new Date(b.post.created_at || 0).getTime() - new Date(a.post.created_at || 0).getTime();
    }
    return 0;
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Sidebar */}
        <div className="hidden md:block">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Trending Posts</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Discover the most popular content on CoCraft.
            </p>
            <Link 
              href="/create" 
              className="block w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center"
            >
              Create Post
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Sort By</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="likes"
                  name="sortBy"
                  value="likes"
                  checked={sortBy === 'likes'}
                  onChange={() => setSortBy('likes')}
                  className="mr-2"
                />
                <label htmlFor="likes" className="text-gray-700 dark:text-gray-300">
                  Most Liked
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="comments"
                  name="sortBy"
                  value="comments"
                  checked={sortBy === 'comments'}
                  onChange={() => setSortBy('comments')}
                  className="mr-2"
                />
                <label htmlFor="comments" className="text-gray-700 dark:text-gray-300">
                  Most Commented
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="newest"
                  name="sortBy"
                  value="newest"
                  checked={sortBy === 'newest'}
                  onChange={() => setSortBy('newest')}
                  className="mr-2"
                />
                <label htmlFor="newest" className="text-gray-700 dark:text-gray-300">
                  Newest
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Posts</h1>
              <div className="flex space-x-2 md:hidden">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  <option value="likes">Most Liked</option>
                  <option value="comments">Most Commented</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
            
            <PostList posts={sortedPosts} loading={loading} error={error} />
          </div>
        </div>
      </div>
    </div>
  );
}
