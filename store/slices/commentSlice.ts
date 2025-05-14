"use client";

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {Comment, CommentWithParentAndUser, CreateCommentPayload, Post} from '@/types';

// Define the comment service interface
interface CommentService {
  // getPostComments: (postId: string) => Promise<CommentWithParentAndUser[]>;
  createComment: (postId: string, commentData: CreateCommentPayload) => Promise<Comment>;
  deleteComment: (commentId: string) => Promise<void>;
}

// Temporary mock implementation
const commentService: CommentService = {
  // getPostComments: async (postId: string) => {
  //
  //   Array(5).fill(0).map((_, index) => ({
  //     id: (index + 1).toString(),
  //     user_id: Math.floor(Math.random() * 5 + 1).toString(),
  //     username: `user${Math.floor(Math.random() * 5 + 1)}`,
  //     content: `This is comment ${index + 1} on post ${postId}`,
  //     created_at: new Date(Date.now() - Math.random() * 10000000).toISOString(),
  //     parent_comment: index % 3 === 0 ? {
  //       id: '0',
  //       user_id: '1',
  //       content: 'This is a parent comment',
  //       created_at: new Date(Date.now() - Math.random() * 20000000).toISOString(),
  //     } : undefined
  //   }));
  // },
  createComment: async (postId: string, commentData: CreateCommentPayload) => {
    // This would be replaced with actual API call
    return {
      id: Math.random().toString(36).substring(7),
      user_id: '1',
      post_id: postId,
      parent_id: commentData.parent_id,
      content: commentData.content,
      created_at: new Date().toISOString()
    };
  },
  deleteComment: async (commentId: string) => {
    // This would be replaced with actual API call
    return;
  }
};

interface CommentState {
  comments: CommentWithParentAndUser[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

export const getPostComments = createAsyncThunk<CommentWithParentAndUser[], string, {rejectValue: string}>(
  'comment/getPostComments',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await commentService.getPostComments(postId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get post comments');
    }
  }
);

export const createComment = createAsyncThunk<Comment, {postId: string, commentData: CreateCommentPayload}, {rejectValue: string}>(
  'comment/createComment',
  async ({ postId, commentData }: { postId: string; commentData: CreateCommentPayload }, { rejectWithValue }) => {
    try {
      const response = await commentService.createComment(postId, commentData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create comment');
    }
  }
);

export const deleteComment = createAsyncThunk<string, string, {rejectValue: string}>(
  'comment/deleteComment',
  async (commentId: string, { rejectWithValue }) => {
    try {
      await commentService.deleteComment(commentId);
      return commentId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
    }
  }
);

const commentSlice = createSlice<CommentState>({
  name: 'comment',
  initialState,
  reducers: {
    clearCommentError: (state: CommentState) => {
      state.error = null;
    },
    clearComments: (state: CommentState) => {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Post Comments
      .addCase(getPostComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostComments.fulfilled, (state, action: PayloadAction<CommentWithParentAndUser[]>) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(getPostComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Comment
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        state.loading = false;
        // We would typically fetch the comments again after creating a new one
        // since the backend would return the comment with user info
        // This is just a placeholder for the mock implementation
        const newComment: CommentWithParentAndUser = {
          id: action.payload.id,
          user_id: action.payload.user_id,
          username: 'Current User', // This would come from the backend
          content: action.payload.content,
          created_at: action.payload.created_at,
          parent_comment: action.payload.parent_id ? {
            id: action.payload.parent_id,
            user_id: '0',
            content: 'Parent comment', // This would come from the backend
            created_at: new Date().toISOString(),
          } : undefined
        };
        state.comments = [newComment, ...state.comments];
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Comment
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.comments = state.comments.filter(comment => comment.id !== action.payload);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCommentError, clearComments } = commentSlice.actions;
export default commentSlice.reducer;
