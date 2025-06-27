"use client";

import {useState, useEffect} from 'react';
import Link from 'next/link';
import {Post} from '@/types';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {toggleLike} from '@/store/slices/postSlice';
import {getPostComments, showCreateComment, toggleCommentVisibility} from "@/store/slices/commentSlice";
import CommentList from '../comment/CommentList';
import ImageCarousel from '../image/ImageCarousel';
import {layout, flex, typography, button, ui, cn, form} from '@/utils/classnames';
import AddCommentForm from "@/components/comment/AddCommentForm";

export interface PostCardProps {
  post: Post;
}

export default function PostCard({post}: PostCardProps) {
  const dispatch = useAppDispatch();

  // !!! use post.likedByUser and post.like_count directly from props.
  // do not use useState(post.likedByUser) -> local state won't get real time updates
  const liked = post.likedByUser;
  const likeCount = post.like_count;

  const showAddComment = useAppSelector(state => !!state.comment.visibleAddComment.includes(post.id))
  const temp = useAppSelector(state => state.comment.visibleAddComment)

  // Get comments state from Redux
  const {commentsByPostId, loadedPosts, visibleCommentPosts, loading} = useAppSelector(state => state.comment);
  // Use refreshed comment count if available, fall back to post.comment_count
  // !!! use '??' (null, undefined) not '||' (0, '', null, undefined)
  const commentCount = useAppSelector(state => state.comment.commentCountByPostId[post.id] ?? post.comment_count);
  const {isAuthenticated} = useAppSelector((state: any) => state.auth);
  const showComments = visibleCommentPosts.includes(post.id);
  const comments = commentsByPostId[post.id] || [];

  const handleLikeToggle = () => {
    dispatch(toggleLike(post.id));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
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
            <div className={cn(ui.avatar.base, ui.avatar.md)}>
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
          <h2 className={cn(typography.h2, "hover:text-accent")}>
            {post.title}
          </h2>

          {/* Post Content */}
          <p className={cn(typography.p1, "mb-4")}>
            {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
          </p>

          {/* Post Images Carousel */}
          {post.images && post.images.length > 0 && (
            <div className="w-1/2 mb-4">
              <ImageCarousel
                images={post.images}
                altText={post.title}
                baseUrl={process.env.NEXT_PUBLIC_S3_BASE_URL || ''}
              />
            </div>
          )}

          {/* TODO: tags to search*/}
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
          <div className={cn(flex.row, flex.betweenAtCenter)}>
            <div className={cn(flex.row, flex.betweenAtCenter, "space-x-4")}>
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
                <span>{commentCount}</span>
              </button>
            </div>

            {!showAddComment &&
              <button
                className={cn(button.ghost)}
                onClick={() => dispatch(showCreateComment(post.id))}>
                Comment
              </button>}
          </div>

          {isAuthenticated && showAddComment && (
            <div className="mb-6">
              {/* !!! add callback/dispatch to Form to trigger a refresh of comments onSuccess */}
              <AddCommentForm postId={post.id as string} onSuccess={() => dispatch(getPostComments(post.id))}/>
            </div>
          )}

          {/* Comments Section - Expandable */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-border-color">
              <h3 className={typography.h3}>Comments {commentCount}</h3>
              {comments.length > 0 ? (
                <div className="space-y-4">
                  <CommentList comments={comments} loading={loading}/>
                  <div
                    className={typography.link + " block text-center"}
                    onClick={() => toggleComments()}
                  >
                    Hide comments
                  </div>
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
