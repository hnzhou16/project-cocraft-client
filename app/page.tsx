"use client"

import React, {Suspense, useEffect, useState} from 'react';
import ClientFeed from '../components/feed/ClientFeed';
import {cn, layout, typography} from "@/utils/classnames";
import {useAppSelector} from "@/store/hooks";

export default function Home() {
  const {isAuthenticated} = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // !!! avoid rendering mismatched content on server vs. client
    return null;
  }

  const feedType = isAuthenticated ? "user" : "public";

  return (
    <div className="container mx-auto px-4 pb-8">
      {/* Welcome Card */}
      <div className={cn(
        "w-full bg-center bg-no-repeat bg-contain h-[30rem]",
        "bg-[url('/images/hero_main.png')]",
        "dark:bg-[url('/images/hero_main_dark.png')]",
      )}
      >
      </div>

      {/* Main Content */}
      <div className={layout.main}>
        <p className={cn(typography.h2, "mb_6")}>{isAuthenticated ? "User Feed" : "Public Feed"}</p>

        {/* React.Suspense is a built-in component that allows you to pause rendering while waiting for something
        typically a lazy-loaded component or async data, a fallback element displays while waiting.*/}
        <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div> as React.ReactNode}>
          <ClientFeed feedType={feedType}/>
        </Suspense>
      </div>
    </div>
  );
}
