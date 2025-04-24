"use client";

import { useState } from 'react';
import { Post } from '@/types';
import PostCard from './PostCard';

interface PostListProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

export default function PostList({ posts, loading, error }: PostListProps) {
  const [sortBy, setSortBy] = useState<'recent' | 'likes' | 'comments'>('recent');

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
    } else if (sortBy === 'likes') {
      return b.like_count - a.like_count;
    } else {
      return b.comment_count - a.comment_count;
    }
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
        <p>Error: {error}</p>
        <button className="mt-2 text-sm text-red-600 dark:text-red-400 underline">Try Again</button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts found</h3>
        <p className="text-gray-600 dark:text-gray-400">Be the first to create a post!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="relative inline-block text-left">
          <div>
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008247]"
              id="sort-menu-button"
              aria-expanded="true"
              aria-haspopup="true"
              onClick={() => document.getElementById('sort-dropdown')?.classList.toggle('hidden')}
            >
              Sort by: {sortBy === 'recent' ? 'Recent' : sortBy === 'likes' ? 'Most Liked' : 'Most Comments'}
              <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div
            id="sort-dropdown"
            className="hidden origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="sort-menu-button"
            tabIndex={-1}
          >
            <div className="py-1" role="none">
              <button
                onClick={() => {
                  setSortBy('recent');
                  document.getElementById('sort-dropdown')?.classList.add('hidden');
                }}
                className={`${sortBy === 'recent' ? 'bg-gray-100 text-[#008247]' : 'text-gray-700'} block px-4 py-2 text-sm w-full text-left hover:bg-gray-100`}
                role="menuitem"
                tabIndex={-1}
              >
                Recent
              </button>
              <button
                onClick={() => {
                  setSortBy('likes');
                  document.getElementById('sort-dropdown')?.classList.add('hidden');
                }}
                className={`${sortBy === 'likes' ? 'bg-gray-100 text-[#008247]' : 'text-gray-700'} block px-4 py-2 text-sm w-full text-left hover:bg-gray-100`}
                role="menuitem"
                tabIndex={-1}
              >
                Most Liked
              </button>
              <button
                onClick={() => {
                  setSortBy('comments');
                  document.getElementById('sort-dropdown')?.classList.add('hidden');
                }}
                className={`${sortBy === 'comments' ? 'bg-gray-100 text-[#008247]' : 'text-gray-700'} block px-4 py-2 text-sm w-full text-left hover:bg-gray-100`}
                role="menuitem"
                tabIndex={-1}
              >
                Most Comments
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {sortedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
