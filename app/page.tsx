import {Suspense} from 'react';
import Link from 'next/link';
import ClientFeed from '../components/feed/ClientFeed';
import {button, cn, flex, typography} from "@/utils/classnames";

export default function Home() {
  return (
    <div className="container mx-auto px-4 pb-8">
      {/* Welcome Card */}
      <div className={cn(
        "w-full bg-cover bg-center bg-no-repeat h-[30rem]",
        "bg-[url('/images/hero_main.png')]",
        "dark:bg-[url('/images/hero_main_dark.png')]"
      )}
      >
      </div>

      {/* Main Content */}
      <div className="bg-card-background rounded-lg shadow-md p-6 mb-6">
        <p className={cn(typography.h2, "mb_6")}>Public Feed</p>

        <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>}>
          <ClientFeed/>
        </Suspense>
      </div>
    </div>
  );
}
