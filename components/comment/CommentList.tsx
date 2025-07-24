import React from 'react';
import {CommentWithParentAndUser} from '@/types';
import Comment from './Comment';
import {typography, ui} from "@/utils/classnames";

interface CommentListProps {
  comments: CommentWithParentAndUser[];
  loading?: boolean;
  error?: string | null;
}

export default function CommentList({comments, loading = false, error = null}: CommentListProps) {
  if (loading) {
    return (
      <div className="items-center justify-center py-4">
        <div className={ui.busy}></div>
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
      <div className="text-center">
        <p className={typography.p3}>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment}/>
      ))}
    </div>
  );
};