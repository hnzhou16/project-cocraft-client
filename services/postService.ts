import { apiCall } from '@/utils/apiUtils';
import { 
  CreatePostPayload, 
  Post, 
  PostWithLikeStatus, 
  UpdatePostPayload,
  PaginationQuery
} from '@/types';

export const postService = {
  // Create a new post
  createPost: async (postData: CreatePostPayload, token: string): Promise<void> => {
    return apiCall<void>('POST', '/post', postData, undefined, token);
  },

  // Get public feed
  getPublicFeed: async (pagination?: PaginationQuery): Promise<PostWithLikeStatus[]> => {
    return apiCall<PostWithLikeStatus[]>('GET', '/feed/public', undefined, pagination as Record<string, string>);
  },

  // Get user feed (following, mentions, etc.)
  getUserFeed: async (pagination?: PaginationQuery): Promise<PostWithLikeStatus[]> => {
    return apiCall<PostWithLikeStatus[]>('GET', '/feed', undefined, pagination as Record<string, string>);
  },

  // Get a post by ID
  getPostById: async (postId: string): Promise<Post> => {
    return apiCall<Post>('GET', `/post/${postId}`);
  },

  // Get all posts by a user
  getPostsByUserId: async (userId: string, pagination?: PaginationQuery): Promise<PostWithLikeStatus[]> => {
    return apiCall<PostWithLikeStatus[]>('GET', `/post/user/${userId}`, undefined, pagination as Record<string, string>);
  },

  // Update a post
  updatePost: async (postId: string, postData: UpdatePostPayload): Promise<Post> => {
    return apiCall<Post>('PATCH', `/post/${postId}`, postData);
  },

  // Toggle like on a post
  toggleLike: async (postId: string): Promise<boolean> => {
    return apiCall<boolean>('PATCH', `/post/${postId}/like`);
  },

  // Delete a post
  deletePost: async (postId: string): Promise<void> => {
    return apiCall<void>('DELETE', `/post/${postId}`);
  },
};

export default postService;
