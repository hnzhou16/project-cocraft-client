import { Suspense } from 'react';
import Link from 'next/link';
import ClientFeed from '../components/feed/ClientFeed';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome to CoCraft</h2>
        <p className="text-gray-700 mb-4">
          Connect with creators, share your work, and get inspired.
        </p>
        <Link 
          href="/create" 
          className="block w-full bg-[#008247] hover:bg-[#006d3d] text-white font-bold py-2 px-4 rounded text-center"
        >
          Create Post
        </Link>
      </div>
      
      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Public Feed</h1>
          <div className="flex space-x-2">
            <Link 
              href="/feed" 
              className="bg-gray-100 text-[#008247] hover:bg-gray-200 px-3 py-1 rounded-full text-sm"
            >
              Following
            </Link>
            <Link 
              href="/feed?mentioned=true" 
              className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-3 py-1 rounded-full text-sm"
            >
              Mentions
            </Link>
          </div>
        </div>
        
        <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>}>
          <ClientFeed />
        </Suspense>
      </div>
    </div>
  );
}
