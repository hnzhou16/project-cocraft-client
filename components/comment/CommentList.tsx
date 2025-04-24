import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CommentWithParentAndUser } from '../../types';

interface CommentListProps {
  comments: CommentWithParentAndUser[];
  loading?: boolean;
  error?: string | null;
}

const CommentList: React.FC<CommentListProps> = ({ comments, loading = false, error = null }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          {/* Comment Header */}
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold text-xs">
              {comment.username.substring(0, 2).toUpperCase()}
            </div>
            <div className="ml-2">
              <span className="font-medium text-gray-900 dark:text-white">{comment.username}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>
          </div>
          
          {/* Parent Comment Reference */}
          {comment.parent_comment && (
            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg mb-2 text-sm">
              <p className="text-gray-500 dark:text-gray-400">
                Replying to: <span className="font-medium">{comment.parent_comment.content.substring(0, 50)}{comment.parent_comment.content.length > 50 ? '...' : ''}</span>
              </p>
            </div>
          )}
          
          {/* Comment Content */}
          <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
