import { apiCall } from '../utils/apiUtils';
import { CommentWithParentAndUser, CreateCommentPayload } from '../types';

export const commentService = {
  // Create a new comment
  createComment: async (postId: string, commentData: CreateCommentPayload): Promise<CommentWithParentAndUser> => {
    return apiCall<CommentWithParentAndUser>('POST', `/post/${postId}/comment`, commentData);
  },

  // Get comments for a post
  getCommentsByPostId: async (postId: string): Promise<CommentWithParentAndUser[]> => {
    return apiCall<CommentWithParentAndUser[]>('GET', `/post/${postId}/comment`);
  },
};

export default commentService;
