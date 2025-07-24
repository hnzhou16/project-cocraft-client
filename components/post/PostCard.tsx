"use client";

import Link from 'next/link';
import {Post} from '@/types';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {toggleLike, deletePost} from '@/store/slices/postSlice';
import {getPostComments, showCreateComment, toggleCommentVisibility} from "@/store/slices/commentSlice";
import CommentList from '../comment/CommentList';
import ImageCarousel from '../image/ImageCarousel';
import {typography, button, ui, cn, nav} from '@/utils/classnames';
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

  // Get comments state from Redux
  const {commentsByPostId, loadedPosts, visibleCommentPosts, loading} = useAppSelector(state => state.comment);
  // Use refreshed comment count if available, fall back to post.comment_count
  // !!! use '??' (null, undefined) not '||' (0, '', null, undefined)
  const commentCount = useAppSelector(state => state.comment.commentCountByPostId[post.id] ?? post.comment_count);
  const {isAuthenticated, user} = useAppSelector(state => state.auth);
  const showComments = visibleCommentPosts.includes(post.id);
  const comments = commentsByPostId[post.id] || [];

  // Check if current user is the post owner
  const isAuthUser = isAuthenticated && user && user.id === post.user_id;

  const handleLikeToggle = () => {
    dispatch(toggleLike(post.id));
  };

  const handleDeletePost = () => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      dispatch(deletePost(post.id));
    }
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
          <div className="flex flex-row justify-between items-start mb-4">
            <Link
              href={`/profile/${post.user_id}`}
              className="flex flex-row">
              <div className={cn(ui.avatar.base, ui.avatar.md)}>
                {post.username.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-primary hover:underline">{post.username}</p>
                <p className="text-xs text-secondary-foreground">{formatDate(post.created_at)}</p>
              </div>
            </Link>

            {/* Delete Button - Only show for post owner */}
            {isAuthUser && (
              <button
                onClick={handleDeletePost}
                className={button.ghost}
                title="Delete post"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            )}
          </div>

          {/* Post Title */}
          <h2 className={cn(typography.h2, "hover:text-accent")}>
            {post.title}
          </h2>

          {/* Post Content */}
          <p className={cn(typography.p1, "mb-4")}>
            {post.content}
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

          {/* Tags as Buttons */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-row flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <Link
                  key={tag}
                  href={`/search?q=${tag}`}
                  className={nav.tag}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Likes and Comments - Below images */}
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center justify-between space-x-4">
              <button
                onClick={handleLikeToggle}
                className="flex flex-row items-center justify-center text-secondary-foreground hover:text-accent"
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
                className="flex flex-row items-center justify-between text-secondary-foreground hover:text-accent"
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
