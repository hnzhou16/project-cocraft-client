"use client";

import {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {Post} from '@/types';
import {useAppDispatch} from '@/store/hooks';
import {fetchPostComments, toggleLike} from '@/store/slices/postSlice';
import {getPostComments} from "@/store/slices/commentSlice";
import {useSelector} from "react-redux";

export interface PostCardProps {
  post: Post;
  isLiked?: boolean;
}

export default function PostCard({post, isLiked = false}: PostCardProps) {
  const dispatch = useAppDispatch();
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [showComments, setShowComments] = useState(false);

  const postWithComments = useSelector(state =>
    state.post.userFeed.find(p => p.id === post.id)
  );

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
    if (!showComments && !post.comments) {
      dispatch(fetchPostComments(post.id))
    }
    setShowComments(!showComments);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        {/* User Info */}
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            {post.username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <Link
              href={`/profile/${post.user_id}`}
              className="text-sm font-medium text-gray-900 hover:underline"
            >
              {post.username}
            </Link>
            <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
          </div>
        </div>

        {/* Post Title */}
        <Link href={`/post/${post.id}`}>
          <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-[#008247]">
            {post.title}
          </h2>
        </Link>

        {/* Post Content */}
        <p className="text-gray-700 mb-4">
          {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
        </p>

        {/* Post Images - Now below content */}
        {post.images && post.images.length > 0 && (
          <div className="mb-4">
            <div className="relative h-48 rounded-lg overflow-hidden">
              <Image
                src={post.images[0]}
                alt={post.title}
                fill
                style={{objectFit: 'cover'}}
              />
            </div>
          </div>
        )}

        {/* Tags as Buttons */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <Link
                key={tag}
                href={`/categories?tag=${tag}`}
                className="bg-gray-100 hover:bg-gray-200 text-[#008247] px-3 py-1 rounded-full text-xs font-medium"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Likes and Comments - Below images */}
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={handleLikeToggle}
            className="flex items-center text-gray-500 hover:text-[#008247]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 mr-1 ${liked ? 'text-[#008247] fill-[#008247]' : ''}`}
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
            className="flex items-center text-gray-500 hover:text-[#008247]"
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
        <div className="pt-4 border-t border-gray-200">
          <Link
            href={`/post/${post.id}#comment`}
            className="w-full flex items-center justify-center py-2 px-4 border border-[#008247] text-[#008247] rounded-md hover:bg-gray-50"
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
        {showComments && postWithComments.comments && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium mb-4">Comments ({post.comment_count})</h3>
            {post.comment_count > 0 ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-start">
                    <div
                      className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-2">
                      U
                    </div>
                    <div>
                      <p className="text-sm font-medium">User</p>
                      <p className="text-sm text-gray-600">This is a sample comment.</p>
                      <p className="text-xs text-gray-400 mt-1">Just now</p>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/post/${post.id}`}
                  className="text-sm text-[#008247] hover:underline block text-center"
                >
                  View all comments
                </Link>
              </div>
            ) : (
              <p className="text-gray-500 text-center">No comments yet. Be the first to comment!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
