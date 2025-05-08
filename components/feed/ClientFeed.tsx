"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {fetchPublicFeed, fetchUserFeed} from '@/store/slices/postSlice';
import PostList from '../post/PostList';
import FeedFilterBar from './FeedFilterBar';
import {useSearchParams} from "next/navigation";

export default function ClientFeed() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const { isAuthenticated } = useAppSelector((state: any) => state.auth);

  const mentioned = searchParams.get('mentioned') === 'true';

  // TODO: public/user feed with filter and pagination
  useEffect(() => {
    // fetch public if not authenticated
    if (!isAuthenticated) {
      dispatch(fetchPublicFeed({
        mentioned,
        following: !mentioned,
      }));
      return;
    }

    // Fetch user feed with appropriate parameters
    dispatch(fetchUserFeed({
      mentioned,
      following: !mentioned,
    }));

  }, [dispatch, isAuthenticated, mentioned]);
  
  return (
    <div>
      <FeedFilterBar />
      <div className="mt-4">
        <PostList/>
      </div>
    </div>
  );
}
