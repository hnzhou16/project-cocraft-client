import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createComment } from '../../store/slices/commentSlice';
import { CreateCommentPayload } from '../../types';

interface AddCommentFormProps {
  postId: string;
  parentId?: string;
  onSuccess?: () => void;
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({ postId, parentId, onSuccess }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state: any) => state.comment);
  
  const [content, setContent] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    const commentData: CreateCommentPayload = {
      content,
      ...(parentId && { parent_id: parentId }),
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
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        {parentId ? 'Add a Reply' : 'Add a Comment'}
      </h3>
      
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
            rows={3}
            required
          />
        </div>
        
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              (loading || !content.trim()) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCommentForm;
