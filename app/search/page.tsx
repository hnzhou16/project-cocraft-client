"use client"

import {cn, layout, typography} from "@/utils/classnames";
import React, {Suspense, useEffect, useState} from "react";
import ClientFeed from "@/components/feed/ClientFeed";
import {useSearchParams} from "next/navigation";

export default function SearchPage() {
  const searchParams = useSearchParams();

  const [query, setQuery] = useState<string | null>(null);

  useEffect(() => {
    const q = searchParams.get("q")?.trim() || "";
    setQuery(q)
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
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
