"use client"

import {cn, layout, typography} from "@/utils/classnames";
import React, {Suspense, useEffect, useState} from "react";
import ClientFeed from "@/components/feed/ClientFeed";
import {useRouter, useSearchParams} from "next/navigation";
import {useAppSelector} from "@/store/hooks";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState<string | null>(null);
  const { isAuthenticated } = useAppSelector((state: any) => state.auth);

  useEffect(() => {
    const q = searchParams.get("q")?.trim() || "";
    setQuery(q)
  }, [searchParams]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className={layout.container}>
      {/* Main Content */}
      {query && <div className={layout.main}>
        <p className={cn(typography.h2, "mb_6")}>Search Results for <span className="italic">"{query}"</span></p>
        <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div> as React.ReactNode}>
          <ClientFeed feedType="search" query={query}/>
        </Suspense>
      </div>
      }
    </div>
  );
}
