"use client";
import { CommentWithParentAndUser } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCommentForReply } from '@/store/slices/commentSlice';
import { formatDistanceToNow } from 'date-fns';

interface CommentProps {
  comment: CommentWithParentAndUser;
}

export default function Comment({ comment }: CommentProps) {
  const dispatch = useAppDispatch();
  const selectedComment = useAppSelector(state => state.comment.selectedComment);
  const isSelected = selectedComment?.id === comment.id;
  
  const handleReply = () => {
    dispatch(selectCommentForReply(comment));
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 ${isSelected ? 'border-2 border-blue-500' : ''}`}>
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
      
      {/* Comment Actions */}
      <div className="mt-2 flex justify-end">
        <button 
          onClick={handleReply}
          className="text-sm text-blue-500 hover:text-blue-700 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          Reply
        </button>
      </div>
    </div>
  );
}
