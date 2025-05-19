"use client";

import {useState, useEffect} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {Post} from '@/types';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {toggleLike} from '@/store/slices/postSlice';
import {getPostComments, toggleCommentVisibility} from "@/store/slices/commentSlice";
import {useSelector} from "react-redux";
import CommentList from '../comment/CommentList';
import ImageCarousel from '../image/ImageCarousel';
import { layout, flex, typography, button, ui, cn } from '@/utils/classnames';

export interface PostCardProps {
  post: Post;
  isLiked?: boolean;
}

export default function PostCard({post, isLiked = false}: PostCardProps) {
  const dispatch = useAppDispatch();
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(post.like_count);

  // Get comments state from Redux
  const {commentsByPostId, loadedPosts, visibleCommentPosts, loading} = useAppSelector(state => state.comment);
  const showComments = visibleCommentPosts.includes(post.id);
  const comments = commentsByPostId[post.id] || [];


  const handleLikeToggle = () => {
    // TODO: toggle not working now
    const likeStatus = dispatch(toggleLike(post.id));
    setLikeCount(prev => prev + 1);
    setLiked(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const toggleComments = async () => {
    if (!loadedPosts.includes(post.id)) {
      dispatch(getPostComments(post.id));
    }
    dispatch(toggleCommentVisibility(post.id));
  };

  return (
    <>
    <div className="card overflow-hidden">
      <div className="p-4">
        {/* User Info */}
        <div className={cn(flex.row, "mb-4")}>
          <div className={ui.avatar.md}>
            {post.username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <Link
              href={`/profile/${post.user_id}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {post.username}
            </Link>
            <p className="text-xs text-secondary-foreground">{formatDate(post.created_at)}</p>
          </div>
        </div>

        {/* Post Title */}
        <Link href={`/post/${post.id}`}>
          <h2 className={cn(typography.h2, "hover:text-accent")}>
            {post.title}
          </h2>
        </Link>

        {/* Post Content */}
        <p className="text-primary mb-4">
          {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
        </p>

        {/* Post Images Carousel */}
        {post.images && post.images.length > 0 && (
          <ImageCarousel 
            images={post.images} 
            altText={post.title} 
            baseUrl={process.env.NEXT_PUBLIC_S3_BASE_URL || ''}
          />
        )}

        {/* Tags as Buttons */}
        {post.tags && post.tags.length > 0 && (
          <div className={cn(flex.row, flex.wrap, "gap-2 mb-4")}>
            {post.tags.map(tag => (
              <Link
                key={tag}
                href={`/categories?tag=${tag}`}
                className={ui.tag}
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Likes and Comments - Below images */}
        <div className={cn(flex.row, "space-x-4 mb-4")}>
          <button
            onClick={handleLikeToggle}
            className={cn(flex.row, flex.center, "text-secondary-foreground hover:text-accent")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={cn("h-5 w-5 mr-1", liked ? 'text-accent fill-accent' : '')}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span>{likeCount}</span>
          </button>

          <button
            onClick={toggleComments}
            className={cn(flex.row, flex.center, "text-secondary-foreground hover:text-accent")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            <span>{post.comment_count}</span>
          </button>
        </div>

        {/* Add Comment Button */}
        <div className="pt-4 border-t border-border-color">
          <Link
            href={`/post/${post.id}#comment`}
            className={cn(button.secondary, "w-full", flex.row, flex.center)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            Add Comment
          </Link>
        </div>

        {/* Comments Section - Expandable */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-border-color">
            <h3 className={typography.h3}>Comments ({post.comment_count})</h3>
            {comments.length > 0 ? (
              <div className="space-y-4">
                <CommentList comments={comments} loading={loading}/>
                <Link
                  href={`/post/${post.id}`}
                  className={typography.link + " block text-center"}
                >
                  View all comments
                </Link>
              </div>
            ) : (
              <p className="text-secondary-foreground text-center">
                {loading ? 'Loading comments...' : 'No comments yet. Be the first to comment!'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>

    </>
  );
}
