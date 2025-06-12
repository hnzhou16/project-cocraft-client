import { apiCall } from '@/utils/apiUtils';
import {CommentWithParentAndUser, CreateCommentPayload, GetCommentsResponse} from '@/types';

export const commentService = {
  // Create a new comment
  createComment: async (postId: string, commentData: CreateCommentPayload): Promise<CommentWithParentAndUser> => {
    return apiCall<CommentWithParentAndUser>('POST', `/post/${postId}/comment`, commentData);
  },

  // Get comments for a post
  getCommentsByPostId: async (postId: string): Promise<GetCommentsResponse> => {
    return apiCall<GetCommentsResponse>('GET', `/post/${postId}/comment`);
  },

  // Delete a comment
  deleteComment: async (commentId: string): Promise<void> => {
    return apiCall<void>('DELETE', `/comment/${commentId}`);
  },
};

export default commentService;