import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {getUserProfile, followUser, unfollowUser, getFollowStatus} from '@/store/slices/userSlice';
import {fetchPostsByUserId} from '@/store/slices/postSlice';
import {User} from '@/types';
import PostList from '../post/PostList';
import {button, cn, nav, typography, ui} from "@/utils/classnames";

interface UserProfileProps {
  userId: string;
}

const UserProfile: React.FC<UserProfileProps> = ({userId}) => {
  const dispatch = useAppDispatch();
  const {selectedProfile, isFollowing, loading: userLoading, error: userError}
    = useAppSelector((state: any) => state.user);
  const {user: selectedUser, post_count, follower_count, following_count} = selectedProfile;
  const {user: authUser} = useAppSelector((state: any) => state.auth);

  const [isAuthUser, setIsAuthUser] = useState(false);

  useEffect(() => {
    dispatch(getUserProfile(userId));

    if (authUser && authUser.id) {
      setIsAuthUser(authUser.id === userId);

      if (authUser.id !== userId) {
        dispatch(getFollowStatus(userId));
      }
    }
  }, [dispatch, userId, authUser, isFollowing]);

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
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
    <div className="card overflow-hidden">
      <div className={cn(
        "relative",
        "w-full bg-cover bg-center bg-no-repeat h-[15rem]",
        "bg-[url('/images/hero_profile.png')]",
        "dark:bg-[url('/images/hero_profile_dark.png')]",
      )}
      >
        {/* User Avatar */}
        <div
          className={cn(ui.avatar.base, ui.avatar.lg, "absolute bottom-0 left-6 translate-y-1/2")}>
          {user.username.substring(0, 1).toUpperCase()}
        </div>
      </div>

      {/* User Info Card */}
      <div className="mt-6 p-6 relative">
        <div className="flex flex-col items-center sm:items-start flex-1 text-center sm:text-left gap-1">
          {/* User Details */}
          <div className="flex flex-col sm:flex-row items-center justify-between w-full">
            <div className='flex flex-row items-center'>
              <p className={cn(typography.h2)}>{user.username.split('_').join(' ')}</p>
              <div
                className={cn(ui.badge.base, ui.badge.outline, 'ml-2')}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </div>
            </div>

            <div className='flex gap-3'>
              <p className={typography.p3}><span className={typography.h4}>{follower_count}</span> Followers</p>
              <p className={typography.p3}><span className={typography.h4}>{following_count}</span> Following</p>
              <p className={typography.p3}><span className={typography.h4}>{post_count}</span> Posts</p>
            </div>
          </div>

          {user.profile?.bio && (
            <p className={cn(typography.p1, "mt-2")}>{user.profile.bio}</p>
          )}

          {user.profile?.location && (
            <div className="flex gap-2 text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" className={nav.icon}>
                <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>
              </svg>
              <p className={typography.p2}>
                {user.profile.location}
              </p>
            </div>
          )}

          {user.profile?.contact?.email && (
            <div className="flex gap-2 text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" className={nav.icon}>
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/>
                <rect x="2" y="4" width="20" height="16" rx="2"/>
              </svg>
              <p className={typography.p2}>
                {user.profile.contact.email}
              </p>
            </div>
          )}

          {user.profile?.contact?.phone && (
            <div className="flex gap-2 text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" className={nav.icon}>
                <path
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/>
              </svg>

              <p className={typography.p2}>
                {user.profile.contact.phone}
              </p>
            </div>
          )}

          <div className="absolute right-6 bottom-6 flex items-center">
            {user.rating && user.rating.rating_count && user.rating.rating_count > 0 && user.rating.total_rating && (
              <div className="flex items-center justify-center sm:justify-start">
                <span className="text-accent">★</span>
                <span className={typography.p2}>
                    {(user.rating.total_rating / user.rating.rating_count).toFixed(1)} ({user.rating.rating_count} {user.rating.rating_count === 1 ? 'review' : 'reviews'})
                  </span>
              </div>
            )}

            {!isAuthUser && authUser && (
              <button
                onClick={handleFollow}
                className={`ml-3 ${
                  isFollowing
                    ? button.secondary
                    : button.primary
                }`}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
