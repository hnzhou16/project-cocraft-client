"use client";

import PostList from '../post/PostList';
import FeedFilterBar from './FeedFilterBar';

export default function ClientFeed() {

  // TODO: optimize FeedFilter and PostList layout
  return (
    <div>
      <FeedFilterBar />
      <div className="mt-4">
        <PostList/>
      </div>
    </div>
  );
}
