'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import {button, typography} from "@/utils/classnames";

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
        <p className={typography.h1}>Oops!</p>
        <p className={typography.h3}>Something went wrong</p>
        <p className={typography.p1}>
          {error.message || 'An unexpected error occurred.'}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={reset}
            className={button.ghost}
          >
            Try Again
          </button>
          <Link 
            href="/" 
            className={typography.link}
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
