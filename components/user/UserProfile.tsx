import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUserById, followUser, unfollowUser, checkFollowStatus } from '../../store/slices/userSlice';
import { fetchPostsByUser } from '../../store/slices/postSlice';
import { User } from '../../types';
import PostList from '../post/PostList';

interface UserProfileProps {
  userId: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const dispatch = useAppDispatch();
  const { selectedUser, isFollowing, loading: userLoading, error: userError } = useAppSelector((state: any) => state.user);
  const { userPosts, loading: postsLoading, error: postsError } = useAppSelector((state: any) => state.post);
  const { user: currentUser } = useAppSelector((state: any) => state.auth);
  
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  
  useEffect(() => {
    dispatch(fetchUserById(userId));
    dispatch(fetchPostsByUser({ userId }));
    
    if (currentUser && currentUser.id) {
      setIsCurrentUser(currentUser.id === userId);
      
      if (currentUser.id !== userId) {
        dispatch(checkFollowStatus(userId));
      }
    }
  }, [dispatch, userId, currentUser]);
  
  const handleFollow = () => {
    if (isFollowing) {
      dispatch(unfollowUser(userId));
    } else {
      dispatch(followUser(userId));
    }
  };
  
  if (userLoading && !selectedUser) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (userError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{userError}</span>
      </div>
    );
  }
  
  if (!selectedUser) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">User not found.</p>
      </div>
    );
  }
  
  const user = selectedUser as User;
  
  return (
    <div className="space-y-8">
      {/* User Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start">
            {/* User Avatar */}
            <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 text-4xl font-bold mb-4 sm:mb-0 sm:mr-6">
              {user.username.substring(0, 2).toUpperCase()}
            </div>
            
            {/* User Details */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{user.username}</h1>
              
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                  {user.role}
                </span>
                {user.is_active && (
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </div>
              
              {user.profile?.bio && (
                <p className="text-gray-700 dark:text-gray-300 mb-4">{user.profile.bio}</p>
              )}
              
              {user.profile?.location && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  <span className="inline-block mr-1">📍</span> {user.profile.location}
                </p>
              )}
              
              {user.rating && user.rating.rating_count && user.rating.rating_count > 0 && user.rating.total_rating && (
                <div className="flex items-center justify-center sm:justify-start mb-4">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1 text-gray-700 dark:text-gray-300">
                    {(user.rating.total_rating / user.rating.rating_count).toFixed(1)} ({user.rating.rating_count} {user.rating.rating_count === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}
              
              {!isCurrentUser && currentUser && (
                <button
                  onClick={handleFollow}
                  className={`mt-2 px-4 py-2 rounded-full text-sm font-medium ${
                    isFollowing
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* User Posts */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Posts</h2>
        <PostList posts={userPosts} loading={postsLoading} error={postsError} />
      </div>
    </div>
  );
};

export default UserProfile;
