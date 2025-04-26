"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPublicFeed } from '@/store/slices/postSlice';
import PostList from '../post/PostList';
import FeedFilterBar from './FeedFilterBar';

export default function ClientFeed() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchPublicFeed());
  }, [dispatch]);
  
  return (
    <div>
      <FeedFilterBar />
      <div className="mt-4">
        <PostList/>
      </div>
    </div>
  );
}
