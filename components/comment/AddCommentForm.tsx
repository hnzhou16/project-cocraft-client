import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createComment, selectCommentForReply } from '@/store/slices/commentSlice';
import { CreateCommentPayload } from '@/types';
import { button, form, layout, flex, cn } from '@/utils/classnames';

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
    <div className="card p-4 mb-4">
      <h3 className="text-lg font-semibold text-primary mb-3">
        {selectedComment ? 'Reply to Comment' : 'Add a Comment'}
      </h3>
      
      {selectedComment && (
        <div className="bg-secondary-background p-3 rounded-lg mb-4">
          <div className={cn(flex.row, flex.between, "items-start")}>
            <div>
              <p className="text-sm font-medium text-primary">
                Replying to {selectedComment.username}
              </p>
              <p className="text-xs text-secondary-foreground mt-1">
                {selectedComment.content.substring(0, 100)}
                {selectedComment.content.length > 100 ? '...' : ''}
              </p>
            </div>
            <button 
              onClick={cancelReply}
              className="text-secondary-foreground hover:text-primary"
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
      
      <form onSubmit={handleSubmit} className={form.container}>
        <div className={form.group}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={form.textarea}
            placeholder="Write your comment here..."
            rows={4}
            required
          />
        </div>
        
        <div className={cn(flex.row, flex.end, "space-x-2")}>
          {selectedComment && (
            <button
              type="button"
              onClick={cancelReply}
              className={button.secondary}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className={cn(
              button.primary,
              (loading || !content.trim()) ? 'opacity-50 cursor-not-allowed' : ''
            )}
          >
            {loading ? 'Posting...' : selectedComment ? 'Post Reply' : 'Post Comment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCommentForm;
