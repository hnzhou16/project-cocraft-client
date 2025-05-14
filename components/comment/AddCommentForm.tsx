import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createComment, selectCommentForReply } from '@/store/slices/commentSlice';
import { CreateCommentPayload } from '@/types';

interface AddCommentFormProps {
  postId: string;
  onSuccess?: () => void;
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({ postId, onSuccess }) => {
  const dispatch = useAppDispatch();
  const { loading, error, selectedComment } = useAppSelector(state => state.comment);
  
  const [content, setContent] = useState('');
  
  // Update content when replying to a comment
  useEffect(() => {
    if (selectedComment) {
      setContent(`> ${selectedComment.content.substring(0, 100)}${selectedComment.content.length > 100 ? '...' : ''}\n\n`);
    }
  }, [selectedComment]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    const commentData: CreateCommentPayload = {
      content,
      ...(selectedComment && { parent_id: selectedComment.id }),
    };
    
    dispatch(createComment({ postId, commentData }))
      .unwrap()
      .then(() => {
        setContent('');
        if (onSuccess) onSuccess();
      })
      .catch((err) => {
        console.error('Failed to add comment:', err);
      });
  };
  
  const cancelReply = () => {
    dispatch(selectCommentForReply(null));
    setContent('');
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        {selectedComment ? 'Reply to Comment' : 'Add a Comment'}
      </h3>
      
      {selectedComment && (
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Replying to {selectedComment.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {selectedComment.content.substring(0, 100)}
                {selectedComment.content.length > 100 ? '...' : ''}
              </p>
            </div>
            <button 
              onClick={cancelReply}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Write your comment here..."
            rows={4}
            required
          />
        </div>
        
        <div className="flex items-center justify-end space-x-2">
          {selectedComment && (
            <button
              type="button"
              onClick={cancelReply}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              (loading || !content.trim()) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Posting...' : selectedComment ? 'Post Reply' : 'Post Comment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCommentForm;
