"use client";

import React, {Suspense, useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import {useAppSelector} from '@/store/hooks';
import {Review} from '@/types';
import UserProfile from '../../../components/user/UserProfile';
import ReviewForm from '../../../components/review/ReviewForm';
import ReviewList from '../../../components/review/ReviewList';
import {cn, layout, typography} from "@/utils/classnames";
import ClientFeed from "@/components/feed/ClientFeed";

export default function ProfilePage() {
  const {userId} = useParams();
  const {user: currentUser} = useAppSelector((state: any) => state.auth);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    if (currentUser && userId) {
      setIsCurrentUser(currentUser.id === userId);
    }
  }, [currentUser, userId]);

  // Mock reviews data - in a real app, this would come from an API call
  const reviews: Review[] = [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main Content - User Profile */}
      <div className="lg:col-span-2">
        {userId && <UserProfile userId={userId as string}/>}
      </div>

      {/* Main Content */}
      <div className={layout.main}>
        <p className={cn(typography.h2, "mb_6")}>Posts</p>
        <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div> as React.ReactNode}>
          <ClientFeed feedType="userPosts" showFilter={false}/>
        </Suspense>
      </div>


      {/* Reviews */}
      <div className="card overflow-hidden">
        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <h2 className={typography.h3}>Reviews</h2>
          <ReviewList reviews={reviews}/>
        </div>

        {!isCurrentUser && currentUser && (
          <ReviewForm ratedUserId={userId as string}/>
        )}
      </div>
    </div>
  );
}
