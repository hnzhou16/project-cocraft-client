"use client";

import {useEffect, useMemo, useRef, useState} from 'react';
import PostCard from './PostCard';
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {button, cn, typography} from "@/utils/classnames";
import {
  fetchPostsByUserId,
  fetchPublicFeed,
  fetchSearchFeed,
  fetchUserFeed
} from "@/store/slices/postSlice";
import {CursorPaginationQuery} from "@/types";

interface PostListProps {
  feedType: 'public' | 'user' | 'trending' | 'search' | 'userPosts';
  query?: string; // for search feed
  userId?: string; // for user profile
}

export default function PostList({feedType, query, userId}: PostListProps) {
  const dispatch = useAppDispatch();

  const {isAuthenticated} = useAppSelector(state => state.auth);
  const {limit, filterParams} = useAppSelector(state => state.post)
  // !!! reuse postList for all pages, dynamically load the right feed
  const feed = useAppSelector(state => state.post[`${feedType}Feed`]);
  // !!! each feed tracks its own cursor, hasMore, etc.
  const {posts, cursor, hasMore, loading, error} = feed;

  const [sortBy, setSortBy] = useState<'recent' | 'likes' | 'comments'>('recent');

  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef(null);

  const sortedPosts = useMemo(() => {
    if (!Array.isArray(posts)) return [];
    return [...posts].sort((a, b) => {
      if (sortBy === 'likes') return b.like_count - a.like_count;
      if (sortBy === 'comments') return b.comment_count - a.comment_count;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    })
  }, [posts, posts.length, sortBy])

  // Initial fetch for all routes
  useEffect(() => {
    if (feedType === 'search' && !query) return; // don't fire if query not ready

    const payload: CursorPaginationQuery = {
      ...filterParams, // !!! carry on the filter when fetching more
      limit,
      sort: 'desc',
      ...(query ? {search: query} : {}),
    };

    // !!! only dispatches on infinite scrolling (separate from the ones in FeedFilterBar)
    // public feed doesn't has infinite scrolling
    switch (feedType) {
      case 'public':
        dispatch(fetchPublicFeed(payload));
        break;
      case 'user':
        dispatch(fetchUserFeed(payload));
        break;
      case 'search':
        dispatch(fetchSearchFeed(payload));
        break;
      case 'userPosts':
        dispatch(fetchPostsByUserId({userId: userId, pagination: payload}));
        break;
    }
  }, [dispatch, feedType, filterParams, limit, query, userId]);

  // Infinite scroll observer
  useEffect(() => {
    // !!! here may be double fetching (both useEffect in act) if too few posts
    if (!cursor) return;

    // observe the DOM at the bottom
    if (!loadMoreRef.current || posts.length == 0) return;

    // update observer
    if (observer.current) observer.current.disconnect();

    // track when the target element (loadMoreRef.current) enters the viewport
    observer.current = new IntersectionObserver((entries) => {
        // console.log('cursor', cursor, 'loading', loading);
        const entry = entries[0];
        const isValidCursor = cursor && cursor !== 'undefined';

        // !!! 'hasMore' flags when no more posts to avoid loading errors
        if (entry.isIntersecting && !loading && hasMore && isValidCursor) {
          const payload: CursorPaginationQuery = {
            limit,
            cursor,
            sort: 'desc',
            ...(query ? {search: query} : {}),
          };

          switch (feedType) {
            case 'user':
              dispatch(fetchUserFeed(payload));
              break;
            case 'search':
              dispatch((fetchSearchFeed(payload)));
              break;
            case 'userPosts':
              dispatch(fetchPostsByUserId({userId: userId, pagination: payload}));
              break;
          }
        }
      },
      {
        rootMargin: '100px', // preload before it's fully visible
      });

    // observe the moved target
    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect(); // clean up
    };
  }, [dispatch, limit, query, cursor, loading, hasMore, feedType, posts.length, userId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-secondary-foreground rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-secondary-foreground rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-secondary-foreground rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-secondary-foreground rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-secondary-background rounded-lg p-6 text-center">
        <p className={typography.h4}>{error}</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div
        className="bg-secondary-background rounded-lg p-6 text-center">
        <p className={typography.h4}>No posts found.</p>
        {/*<p className={typography.p1}>Be the first to create a post!</p>*/}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="relative inline-block text-left">
          <div>
            <button
              type="button"
              className={cn(button.sort, "inline-flex justify-center w-full")}
              id="sort-menu-button"
              aria-expanded="true"
              aria-haspopup="true"
              onClick={() => document.getElementById('sort-dropdown')?.classList.toggle('hidden')}
            >
              Sort by: {sortBy === 'recent' ? 'Recent' : sortBy === 'likes' ? 'Most Liked' : 'Most Comments'}
              <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                   fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"/>
              </svg>
            </button>
          </div>

          <div
            id="sort-dropdown"
            className="hidden origin-top-right absolute right-0 mt-2 w-52 rounded-md shadow-lg bg-background ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="sort-menu-button"
            tabIndex={-1}
          >
            <div className="py-1" role="none">
              <button
                onClick={() => {
                  setSortBy('recent');
                  document.getElementById('sort-dropdown')?.classList.add('hidden');
                }}
                className={sortBy === 'recent' ? button.sortDropDownActive : button.sortDropDown}
                role="menuitem"
                tabIndex={-1}
              >
                Recent
              </button>
              <button
                onClick={() => {
                  setSortBy('likes');
                  document.getElementById('sort-dropdown')?.classList.add('hidden');
                }}
                className={sortBy === 'likes' ? button.sortDropDownActive : button.sortDropDown}
                role="menuitem"
                tabIndex={-1}
              >
                Most Liked
              </button>
              <button
                onClick={() => {
                  setSortBy('comments');
                  document.getElementById('sort-dropdown')?.classList.add('hidden');
                }}
                className={sortBy === 'comments' ? button.sortDropDownActive : button.sortDropDown}
                role="menuitem"
                tabIndex={-1}
              >
                Most Comments
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {sortedPosts && sortedPosts?.map((post) => (
          <PostCard
            key={`${feedType}-${post.id}`}
            post={post}
          />
        ))}
        {!hasMore && <p
          className={cn(typography.p1, "text-center")}>{isAuthenticated
          ? "No more posts to load." : "Please log in to see more posts."}</p>}

        {loading &&
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-secondary-foreground rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-secondary-foreground rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-secondary-foreground rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-secondary-foreground rounded w-1/4"></div>
              </div>
            ))}
          </div>}

        <div ref={loadMoreRef}></div>
      </div>
    </div>
  );
}
