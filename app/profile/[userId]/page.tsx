"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppSelector } from '../../../store/hooks';
import { Review } from '../../../types';
import UserProfile from '../../../components/user/UserProfile';
import ReviewForm from '../../../components/review/ReviewForm';
import ReviewList from '../../../components/review/ReviewList';

export default function ProfilePage() {
  const { userId } = useParams();
  const { user: currentUser } = useAppSelector((state: any) => state.auth);
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - User Profile */}
        <div className="lg:col-span-2">
          {userId && <UserProfile userId={userId as string} />}
        </div>
        
        {/* Sidebar - Reviews */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reviews</h2>
            <ReviewList reviews={reviews} />
          </div>
          
          {!isCurrentUser && currentUser && (
            <ReviewForm ratedUserId={userId as string} />
          )}
        </div>
      </div>
    </div>
  );
}
