import {CreatePostPayload, UpdatePostPayload, PostWithLikeStatus, Post, CursorPaginationQuery} from "@/types";

// Mock implementation that reflects the latest API structure
const mockPostService = {
  // Create a new post
  createPost: async (postData: CreatePostPayload, token: string): Promise<void> => {
    // Mock API call - returns void as per actual service
    console.log('Mock: Creating post', postData);
    return;
  },

  // Get public feed
  getPublicFeed: async (pagination?: CursorPaginationQuery): Promise<PostWithLikeStatus[]> => {
    return Array(10).fill(0).map((_, index) => ({
      post: {
        id: (index + 1).toString(),
        user_id: Math.floor(Math.random() * 5 + 1).toString(),
        username: `user${Math.floor(Math.random() * 5 + 1)}`,
        user_role: 'contractor' as any,
        title: `Public Post ${index + 1}`,
        content: `This is public post ${index + 1} content`,
        tags: ['public', `post${index + 1}`],
        mentions: [],
        images: [],
        like_count: Math.floor(Math.random() * 100),
        likedByUser: Math.random() > 0.5,
        comment_count: Math.floor(Math.random() * 20),
        version: 1,
        created_at: new Date(Date.now() - Math.random() * 10000000).toISOString(),
        updated_at: new Date(Date.now() - Math.random() * 1000000).toISOString()
      },
      username: `user${Math.floor(Math.random() * 5 + 1)}`,
      liked_by_user: Math.random() > 0.5
    }));
  },

  // Get user feed (following, mentions, etc.)
  getUserFeed: async (pagination?: CursorPaginationQuery): Promise<PostWithLikeStatus[]> => {
    return Array(10).fill(0).map((_, index) => ({
      post: {
        id: (index + 1).toString(),
        user_id: Math.floor(Math.random() * 5 + 1).toString(),
        username: `user${Math.floor(Math.random() * 5 + 1)}`,
        user_role: 'designer' as any,
        title: `User Feed Post ${index + 1}`,
        content: `This is user feed post ${index + 1} content`,
        tags: ['feed', `post${index + 1}`],
        mentions: [],
        images: [],
        like_count: Math.floor(Math.random() * 100),
        likedByUser: Math.random() > 0.5,
        comment_count: Math.floor(Math.random() * 20),
        version: 1,
        created_at: new Date(Date.now() - Math.random() * 10000000).toISOString(),
        updated_at: new Date(Date.now() - Math.random() * 1000000).toISOString()
      },
      username: `user${Math.floor(Math.random() * 5 + 1)}`,
      liked_by_user: Math.random() > 0.5
    }));
  },

  // Get all posts by a user
  getPostsByUserId: async (userId: string, pagination?: CursorPaginationQuery): Promise<PostWithLikeStatus[]> => {
    return Array(5).fill(0).map((_, index) => ({
      post: {
        id: (index + 1).toString(),
        user_id: userId,
        username: `user${userId}`,
        user_role: 'homeowner' as any,
        title: `User ${userId} Post ${index + 1}`,
        content: `This is user ${userId} post ${index + 1} content`,
        tags: ['user', `post${index + 1}`],
        mentions: [],
        images: [],
        like_count: Math.floor(Math.random() * 100),
        likedByUser: Math.random() > 0.5,
        comment_count: Math.floor(Math.random() * 20),
        version: 1,
        created_at: new Date(Date.now() - Math.random() * 10000000).toISOString(),
        updated_at: new Date(Date.now() - Math.random() * 1000000).toISOString()
      },
      username: `user${userId}`,
      liked_by_user: Math.random() > 0.5
    }));
  },

  // Search Posts
  searchPosts: async (pagination?: CursorPaginationQuery): Promise<PostWithLikeStatus[]> => {
    const query = pagination?.search || 'search';
    return Array(5).fill(0).map((_, index) => ({
      post: {
        id: (index + 1).toString(),
        user_id: Math.floor(Math.random() * 5 + 1).toString(),
        username: `user${Math.floor(Math.random() * 5 + 1)}`,
        user_role: 'manufacturer' as any,
        title: `Search Result ${index + 1} for "${query}"`,
        content: `This is search result ${index + 1} for "${query}" content`,
        tags: ['search', query, `result${index + 1}`],
        mentions: [],
        images: [],
        like_count: Math.floor(Math.random() * 100),
        likedByUser: Math.random() > 0.5,
        comment_count: Math.floor(Math.random() * 20),
        version: 1,
        created_at: new Date(Date.now() - Math.random() * 10000000).toISOString(),
        updated_at: new Date(Date.now() - Math.random() * 1000000).toISOString()
      },
      username: `user${Math.floor(Math.random() * 5 + 1)}`,
      liked_by_user: Math.random() > 0.5
    }));
  },

  // Update a post
  updatePost: async (postId: string, postData: UpdatePostPayload): Promise<Post> => {
    return {
      id: postId,
      user_id: '1',
      username: 'current_user',
      user_role: 'contractor' as any,
      title: postData.title || 'Updated Post',
      content: postData.content || 'Updated content',
      tags: postData.tags || [],
      mentions: [],
      images: postData.images_path || [],
      like_count: 5,
      likedByUser: false,
      comment_count: 2,
      version: postData.version + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },

  // Toggle like on a post
  toggleLike: async (postId: string): Promise<boolean> => {
    // Mock returns random like status
    return Math.random() > 0.5;
  },

  // Delete a post
  deletePost: async (postId: string): Promise<void> => {
    console.log('Mock: Deleting post', postId);
    return;
  },
};

export default mockPostService;
