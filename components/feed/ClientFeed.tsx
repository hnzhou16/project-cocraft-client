"use client";

import PostList from '../post/PostList';
import FeedFilterBar from './FeedFilterBar';
import {useEffect} from "react";

// !!! dynamically Set feedType in ClientFeed, so it can pass the correct feedType to FeedFilterBar and PostList
interface ClientFeedProps {
  feedType: 'public' | 'user' | 'search' | 'userPosts';
  query?: string; // for search feed
  showFilter?: boolean; // show FeedFilterBar
  userId?: string; // for user profile
}
export default function ClientFeed({feedType, query, showFilter=true, userId}: ClientFeedProps) {
  return (
    <div>
      {showFilter && <FeedFilterBar feedType={feedType} query={query} usrId={userId} />}
      <div className="mt-4">
        <PostList feedType={feedType} query={query} userId={userId} />
      </div>
    </div>
  );
}
