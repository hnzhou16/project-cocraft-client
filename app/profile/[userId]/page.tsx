"use client";

import React, {Suspense, useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import {useAppSelector} from '@/store/hooks';
import UserProfile from "@/components/user/UserProfile";
import ReviewList from "@/components/review/ReviewList";
import ReviewForm from "@/components/review/ReviewForm";
import {cn, layout, typography} from "@/utils/classnames";
import ClientFeed from "@/components/feed/ClientFeed";

export default function ProfilePage() {
  const {userId} = useParams();

  const [isAuthUser, setIsAuthUser] = useState(false);
  const {user: authUser} = useAppSelector((state: any) => state.auth);

  useEffect(() => {
    if (authUser && userId) {
      setIsAuthUser(authUser.id === userId);
    }
  }, [authUser, userId]);

  return (
    <div className="container mx-auto px-4 py-8">

      {/* Main Content - User Profile */}
      <div className="lg:col-span-2">
        {userId && <UserProfile userId={userId as string}/>}
      </div>

      {/* Main Content */}
      <div className={layout.main}>
        <p className={cn(typography.h2, "mb_6")}>Posts</p>
        {userId &&
          <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div> as React.ReactNode}>
            <ClientFeed feedType="userPosts" showFilter={false} userId={userId as string}/>
          </Suspense>
        }
      </div>

      {/* Reviews */}
      <div className="card overflow-hidden">
        <div className="bg-background rounded-lg shadow-md p-6">
          <p className={typography.h3}>Reviews</p>
          {userId && <ReviewList userId={userId as string}/>}
        </div>

        {!isAuthUser && authUser && (
          <ReviewForm ratedUserId={userId as string}/>
        )}
      </div>
    </div>
  );
}
