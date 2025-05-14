"use client";

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPostById } from '@/store/slices/postSlice';
import { getPostComments } from '@/store/slices/commentSlice';
import PostCard from '../../../components/post/PostCard';
import CommentList from '../../../components/comment/CommentList';
import AddCommentForm from '../../../components/comment/AddCommentForm';

export default function PostDetailPage() {
  const { postId } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { selectedPost, loading: postLoading, error: postError } = useAppSelector((state: any) => state.post);
  const { comments, loading: commentsLoading, error: commentsError } = useAppSelector((state: any) => state.comment);
  const { isAuthenticated } = useAppSelector((state: any) => state.auth);
  
  useEffect(() => {
    if (postId) {
      dispatch(fetchPostById(postId as string));
      dispatch(getPostComments(postId as string));
    }
  }, [dispatch, postId]);
  
  if (postLoading && !selectedPost) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  if (postError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{postError}</span>
        </div>
        <div className="mt-4">
          <Link href="/" className="text-blue-500 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  if (!selectedPost) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Post not found.</p>
        </div>
        <div className="mt-4 text-center">
          <Link href="/" className="text-blue-500 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/" className="text-blue-500 hover:underline">
          &larr; Back to Home
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {selectedPost && (
            <PostCard 
              post={selectedPost} 
              isLiked={false} // This would come from the API in a real app
              showActions={true}
            />
          )}
          
          {/* Comments Section */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Comments</h2>
            
            {isAuthenticated && (
              <div className="mb-6">
                <AddCommentForm postId={postId as string} />
              </div>
            )}
            
            <CommentList 
              comments={comments} 
              loading={commentsLoading} 
              error={commentsError} 
            />
          </div>
        </div>
        
        {/* Sidebar */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About the Author</h2>
            
            {selectedPost && (
              <div>
                <Link href={`/profile/${selectedPost.user_id}`} className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold">
                    {selectedPost.user_id.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <span className="font-semibold text-gray-900 dark:text-white hover:underline">
                      User ID: {selectedPost.user_id.substring(0, 8)}...
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedPost.user_role}
                    </p>
                  </div>
                </Link>
                
                <Link 
                  href={`/profile/${selectedPost.user_id}`}
                  className="block w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center"
                >
                  View Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
