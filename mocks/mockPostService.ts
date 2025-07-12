import PostService from "@/services/postService";
import {CreatePostPayload, UpdatePostPayload} from "@/types";

// TODO: Mock files

// Temporary mock implementation
const postService: PostService = {
  createPost: async (postData: CreatePostPayload) => {
    // This would be replaced with actual API call
    return {
      id: Math.random().toString(36).substring(7),
      user_id: '1',
      user_role: 'user' as any,
      title: postData.title,
      content: postData.content,
      tags: postData.tags || [],
      mentions: [],
      images: postData.images_path || [],
      like_count: 0,
      comment_count: 0,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },
  updatePost: async (postId: string, postData: UpdatePostPayload) => {
    // This would be replaced with actual API call
    return {
      id: postId,
      user_id: '1',
      user_role: 'user' as any,
      title: postData.title || 'Updated Post',
      content: postData.content || 'Updated content',
      tags: postData.tags || [],
      mentions: [],
      images: postData.images_path || [],
      like_count: 5,
      comment_count: 2,
      version: postData.version + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },
  deletePost: async (postId: string) => {
    // This would be replaced with actual API call
    return;
  },
  getPost: async (postId: string) => {
    // This would be replaced with actual API call
    return {
      id: postId,
      user_id: '1',
      user_role: 'user' as any,
      title: 'Sample Post',
      content: 'This is a sample post content',
      tags: ['sample', 'post'],
      mentions: [],
      images: [],
      like_count: 10,
      comment_count: 5,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },
  likePost: async (postId: string) => {
    // This would be replaced with actual API call
    return;
  },
  unlikePost: async (postId: string) => {
    // This would be replaced with actual API call
    return;
  },
  getPublicFeed: async (pagination?: PaginationQuery) => {
    // This would be replaced with actual API call
    return Array(10).fill(0).map((_, index) => ({
      id: (index + 1).toString(),
      user_id: Math.floor(Math.random() * 5 + 1).toString(),
      user_role: 'user' as any,
      title: `Public Post ${index + 1}`,
      content: `This is public post ${index + 1} content`,
      tags: ['public', `post${index + 1}`],
      mentions: [],
      images: [],
      like_count: Math.floor(Math.random() * 100),
      comment_count: Math.floor(Math.random() * 20),
      version: 1,
      created_at: new Date(Date.now() - Math.random() * 10000000).toISOString(),
      updated_at: new Date(Date.now() - Math.random() * 1000000).toISOString()
    }));
  },
  getUserFeed: async (pagination?: PaginationQuery) => {
    // This would be replaced with actual API call
    return Array(10).fill(0).map((_, index) => ({
      id: (index + 1).toString(),
      user_id: Math.floor(Math.random() * 5 + 1).toString(),
      user_role: 'user' as any,
      title: `User Feed Post ${index + 1}`,
      content: `This is user feed post ${index + 1} content`,
      tags: ['feed', `post${index + 1}`],
      mentions: [],
      images: [],
      like_count: Math.floor(Math.random() * 100),
      comment_count: Math.floor(Math.random() * 20),
      version: 1,
      created_at: new Date(Date.now() - Math.random() * 10000000).toISOString(),
      updated_at: new Date(Date.now() - Math.random() * 1000000).toISOString()
    }));
  },
  getUserPosts: async (userId: string, pagination?: PaginationQuery) => {
    // This would be replaced with actual API call
    return Array(5).fill(0).map((_, index) => ({
      id: (index + 1).toString(),
      user_id: userId,
      user_role: 'user' as any,
      title: `User ${userId} Post ${index + 1}`,
      content: `This is user ${userId} post ${index + 1} content`,
      tags: ['user', `post${index + 1}`],
      mentions: [],
      images: [],
      like_count: Math.floor(Math.random() * 100),
      comment_count: Math.floor(Math.random() * 20),
      version: 1,
      created_at: new Date(Date.now() - Math.random() * 10000000).toISOString(),
      updated_at: new Date(Date.now() - Math.random() * 1000000).toISOString()
    }));
  },
  getTrendingPosts: async (pagination?: PaginationQuery) => {
    // This would be replaced with actual API call
    return Array(10).fill(0).map((_, index) => ({
      id: (index + 1).toString(),
      user_id: Math.floor(Math.random() * 5 + 1).toString(),
      user_role: 'user' as any,
      title: `Trending Post ${index + 1}`,
      content: `This is trending post ${index + 1} content`,
      tags: ['trending', `post${index + 1}`],
      mentions: [],
      images: [],
      like_count: Math.floor(Math.random() * 1000 + 500),
      comment_count: Math.floor(Math.random() * 200 + 50),
      version: 1,
      created_at: new Date(Date.now() - Math.random() * 10000000).toISOString(),
      updated_at: new Date(Date.now() - Math.random() * 1000000).toISOString()
    }));
  },
  searchPosts: async (query: string, pagination?: PaginationQuery) => {
    // This would be replaced with actual API call
    return Array(5).fill(0).map((_, index) => ({
      id: (index + 1).toString(),
      user_id: Math.floor(Math.random() * 5 + 1).toString(),
      user_role: 'user' as any,
      title: `Search Result ${index + 1} for "${query}"`,
      content: `This is search result ${index + 1} for "${query}" content`,
      tags: ['search', query, `result${index + 1}`],
      mentions: [],
      images: [],
      like_count: Math.floor(Math.random() * 100),
      comment_count: Math.floor(Math.random() * 20),
      version: 1,
      created_at: new Date(Date.now() - Math.random() * 10000000).toISOString(),
      updated_at: new Date(Date.now() - Math.random() * 1000000).toISOString()
    }));
  }
};