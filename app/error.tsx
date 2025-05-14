'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">Oops!</h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={reset}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full"
          >
            Try Again
          </button>
          <Link 
            href="/" 
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-full"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
