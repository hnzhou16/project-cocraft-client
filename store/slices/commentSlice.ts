"use client";

import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {CommentWithParentAndUser, CreateCommentPayload} from '@/types';
import {commentService} from "@/services";

interface CommentState {
  // Store comments by postId
  commentsByPostId: Record<string, CommentWithParentAndUser[]>;
  // Store comments count by postId
  commentCountByPostId: Record<string, number>;
  // Track which posts have had their comments loaded
  loadedPosts: string[];
  // Track which posts have their comments visible
  visibleCommentPosts: string[];
  // Track which posts show create comment section
  visibleAddComment: string[];
  // Selected comment for replying
  selectedComment: CommentWithParentAndUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  commentsByPostId: {},
  commentCountByPostId: {},
  loadedPosts: [],
  visibleCommentPosts: [],
  visibleAddComment: [],
  selectedComment: null,
  loading: false,
  error: null,
};

export const getPostComments = createAsyncThunk<
  { postId: string; comments: CommentWithParentAndUser[]; commentCount: number },
  string,
  { rejectValue: string }
>(
  'comment/getPostComments',
  async (postId: string, {rejectWithValue}) => {
    try {
      const {comments, comment_count} = await commentService.getCommentsByPostId(postId);
      return {postId, comments, commentCount: comment_count};
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get post comments');
    }
  }
);

export const createComment = createAsyncThunk<
  { postId: string; comment: CommentWithParentAndUser },
  { postId: string; commentData: CreateCommentPayload },
  { rejectValue: string }
>(
  'comment/createComment',
  async ({postId, commentData}, {rejectWithValue}) => {
    try {
      const comment = await commentService.createComment(postId, commentData);
      return {postId, comment};
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create comment');
    }
  }
);

export const deleteComment = createAsyncThunk<
  { postId: string; commentId: string },
  { postId: string; commentId: string },
  { rejectValue: string }
>(
  'comment/deleteComment',
  async ({postId, commentId}, {rejectWithValue}) => {
    try {
      await commentService.deleteComment(commentId);
      return {postId, commentId};
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
      state.commentsByPostId = {};
      state.loadedPosts = [];
      state.visibleCommentPosts = [];
    },
    toggleCommentVisibility: (state: CommentState, action: PayloadAction<string>) => {
      const postId = action.payload;
      if (state.visibleCommentPosts.includes(postId)) {
        state.visibleCommentPosts = state.visibleCommentPosts.filter(id => id !== postId);
      } else {
        state.visibleCommentPosts.push(postId);
      }
    },
    selectCommentForReply: (state: CommentState, action: PayloadAction<CommentWithParentAndUser | null>) => {
      state.selectedComment = action.payload;
    },
    showCreateComment: (state: CommentState, action: PayloadAction<string>) => {
      const postId = action.payload;
      if (!state.visibleAddComment.includes(postId)) {
        state.visibleAddComment.push(postId)
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Post Comments
      .addCase(getPostComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostComments.fulfilled, (state, action) => {
        const {postId, comments, commentCount} = action.payload;
        state.commentCountByPostId[postId] = commentCount
        // Sort comments by creation date (newest first)
        const sortedComments = [...comments].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        state.commentsByPostId[postId] = sortedComments;
        if (!state.loadedPosts.includes(postId)) {
          state.loadedPosts.push(postId);
        }
        state.loading = false;
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
      .addCase(createComment.fulfilled, (state, action) => {
        const {postId, comment} = action.payload;
        state.loading = false;

        // Add the new comment to the beginning of the array (newest first)
        if (state.commentsByPostId[postId]) {
          state.commentsByPostId[postId] = [comment, ...state.commentsByPostId[postId]];
        } else {
          state.commentsByPostId[postId] = [comment];
          state.loadedPosts.push(postId);
        }

        // Clear the selected comment after replying
        state.selectedComment = null;
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
      .addCase(deleteComment.fulfilled, (state, action) => {
        const {postId, commentId} = action.payload;
        state.loading = false;
        if (state.commentsByPostId[postId]) {
          state.commentsByPostId[postId] = state.commentsByPostId[postId].filter(
            comment => comment.id !== commentId
          );
        }
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearCommentError,
  clearComments,
  toggleCommentVisibility,
  selectCommentForReply,
  showCreateComment,
} = commentSlice.actions;
export default commentSlice.reducer;
