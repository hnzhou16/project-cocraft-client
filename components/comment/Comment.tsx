"use client";
import { CommentWithParentAndUser } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCommentForReply } from '@/store/slices/commentSlice';
import { formatDistanceToNow } from 'date-fns';
import { layout, flex, typography, ui, cn } from '@/utils/classnames';

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
    <div className={cn(
      "card p-4",
      isSelected ? 'border-2 border-accent' : ''
    )}>
      {/* Comment Header */}
      <div className={cn(flex.row, "mb-2")}>
        <div className={ui.avatar.sm}>
          {comment.username.substring(0, 2).toUpperCase()}
        </div>
        <div className="ml-2">
          <span className="font-medium text-primary">{comment.username}</span>
          <span className="text-xs text-secondary-foreground ml-2">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
          </span>
        </div>
      </div>
      
      {/* Parent Comment Reference */}
      {comment.parent_comment && (
        <div className="bg-secondary-background p-2 rounded-lg mb-2 text-sm">
          <p className="text-secondary-foreground">
            Replying to: <span className="font-medium">{comment.parent_comment.content.substring(0, 50)}{comment.parent_comment.content.length > 50 ? '...' : ''}</span>
          </p>
        </div>
      )}
      
      {/* Comment Content */}
      <p className="text-primary">{comment.content}</p>
      
      {/* Comment Actions */}
      <div className={cn(flex.row, flex.end, "mt-2")}>
        <button 
          onClick={handleReply}
          className={cn(flex.row, flex.center, "text-sm text-accent hover:text-accent-hover")}
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
