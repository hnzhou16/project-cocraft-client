import { apiCall } from '@/utils/apiUtils';
import {
  CreatePostPayload,
  Post,
  PostWithLikeStatus,
  UpdatePostPayload,
  CursorPaginationQuery, FeedResponse
} from '@/types';

export const postService = {
  // Create a new post
  createPost: async (postData: CreatePostPayload, token: string): Promise<void> => {
    return apiCall<void>('POST', '/post', postData, undefined, token);
  },

  // Get public feed
  getPublicFeed: async (pagination?: CursorPaginationQuery): Promise<FeedResponse> => {
    return apiCall<FeedResponse>('GET', '/feed/public', undefined, pagination as Record<string, string>);
  },

  // Get user feed (following, mentions, etc.)
  getUserFeed: async (pagination?: CursorPaginationQuery): Promise<FeedResponse> => {
    return apiCall<FeedResponse>('GET', '/feed/user', undefined, pagination as Record<string, string>);
  },

  // Get all posts by a user
  getPostsByUserId: async (userId: string, pagination?: CursorPaginationQuery): Promise<FeedResponse> => {
    return apiCall<FeedResponse>('GET', `/post/user/${userId}`, undefined, pagination as Record<string, string>);
  },

  // Search Posts
  searchPosts: async (pagination?: CursorPaginationQuery): Promise<FeedResponse> => {
    return apiCall<FeedResponse>('GET', '/feed/search', undefined, pagination as Record<string, string>);
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
