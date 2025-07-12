import Link from 'next/link';
import {typography} from "@/utils/classnames";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className={typography.h1}>404</p>
        <p className={typography.h2}>Page Not Found</p>
        <p className={typography.p1}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          href="/" 
          className={typography.link}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
