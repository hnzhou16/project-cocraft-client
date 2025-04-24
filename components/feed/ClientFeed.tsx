"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPublicFeed } from '@/store/slices/postSlice';
import PostList from '../post/PostList';
import FeedFilterBar from './FeedFilterBar';

export default function ClientFeed() {
  const dispatch = useAppDispatch();
  const { publicFeed, userFeed, loading, error } = useAppSelector((state: any) => state.post);
  const posts = userFeed.length > 0 ? userFeed : publicFeed;
  
  useEffect(() => {
    dispatch(fetchPublicFeed());
  }, [dispatch]);
  
  return (
    <div>
      <FeedFilterBar />
      <div className="mt-4">
        <PostList posts={posts} loading={loading} error={error} />
      </div>
    </div>
  );
}
