"use client";

import { useState, useEffect } from 'react';
import { useTheme } from '../../providers/ThemeProvider';
import { apiCall } from '../../utils/apiUtils';
import Link from 'next/link';

export default function TestPage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Try to fetch public feed from API
        const data = await apiCall('GET', '/feed/public');
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching posts:', err);
        setError(err.message || 'Failed to fetch posts');
        setLoading(false);
        
        // If API call fails, use mock data
        setPosts([
          { 
            post: {
              id: '1',
              title: 'Test Post 1',
              content: 'This is a test post to demonstrate the UI',
              created_at: new Date().toISOString()
            },
            liked_by_user: false
          },
          {
            post: {
              id: '2',
              title: 'Test Post 2',
              content: 'Another test post with more content to show scrolling behavior',
              created_at: new Date().toISOString()
            },
            liked_by_user: true
          }
        ]);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">Test Page</h1>
        <p className="mb-4">This page demonstrates the features implemented:</p>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Dark Mode Toggle</h2>
            <p className="mb-2">Current mode: <span className="font-medium">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span></p>
            <button 
              onClick={toggleDarkMode}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Toggle Dark Mode
            </button>
          </div>

          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Sticky Header & Sidebar</h2>
            <p className="mb-2">Current scroll position: <span className="font-medium">{scrollPosition}px</span></p>
            <p>Scroll down to see the header and sidebar remain fixed.</p>
          </div>

          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">API Connection</h2>
            {loading ? (
              <p>Loading posts...</p>
            ) : error ? (
              <div>
                <p className="text-red-500 mb-2">Error: {error}</p>
                <p>Using mock data instead</p>
              </div>
            ) : (
              <p>Successfully connected to API</p>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Posts</h2>
      <div className="space-y-4">
        {posts.map((postData) => (
          <div key={postData.post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">{postData.post.title}</h3>
            <p className="mb-4">{postData.post.content}</p>
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>Posted: {new Date(postData.post.created_at).toLocaleDateString()}</span>
              <div className="flex items-center">
                <button className={`mr-2 ${postData.liked_by_user ? 'text-red-500' : ''}`}>
                  ❤️ {postData.liked_by_user ? 'Liked' : 'Like'}
                </button>
                <button>💬 Comment</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add more content to enable scrolling */}
      <div className="mt-20 space-y-8">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Scroll Test {index + 1}</h3>
            <p>This content is here to demonstrate the sticky header and sidebar when scrolling.</p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
