"use client";

import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {
  Post,
  CreatePostPayload,
  UpdatePostPayload,
  PaginationQuery,
  PostWithLikeStatus,
  CommentWithParentAndUser
} from '@/types';
import {commentService, postService} from "@/services";

// Define the post service interface
interface PostService {
  createPost: (postData: CreatePostPayload) => Promise<Post>;
  getPublicFeed: (pagination?: PaginationQuery) => Promise<Post[]>;
  getUserFeed: (pagination?: PaginationQuery) => Promise<Post[]>;
  getPostById: (postId: string) => Promise<Post>;
  getPostsByUserId: (userId: string, pagination?: PaginationQuery) => Promise<PostWithLikeStatus[]>;
  updatePost: (postId: string, postData: UpdatePostPayload) => Promise<Post>;
  toggleLike: (postId: string) => Promise<boolean>;
  deletePost: (postId: string) => Promise<void>;

  // TODO: trendingPosts and searchPosts features
  // getUserPosts: (userId: string, pagination?: PaginationQuery) => Promise<Post[]>;
  // getTrendingPosts: (pagination?: PaginationQuery) => Promise<Post[]>;
  // searchPosts: (query: string, pagination?: PaginationQuery) => Promise<Post[]>;
}

// Temporary mock implementation
// const postService: PostService = {
//   createPost: async (postData: CreatePostPayload) => {
//     // This would be replaced with actual API call
//     return {
//       id: Math.random().toString(36).substring(7),
//       user_id: '1',
//       user_role: 'user' as any,
//       title: postData.title,
//       content: postData.content,
//       tags: postData.tags || [],
//       mentions: [],
//       images: postData.images_path || [],
//       like_count: 0,
//       comment_count: 0,
//       version: 1,
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString()
//     };
//   },
//   updatePost: async (postId: string, postData: UpdatePostPayload) => {
//     // This would be replaced with actual API call
//     return {
//       id: postId,
//       user_id: '1',
//       user_role: 'user' as any,
//       title: postData.title || 'Updated Post',
//       content: postData.content || 'Updated content',
//       tags: postData.tags || [],
//       mentions: [],
//       images: postData.images_path || [],
//       like_count: 5,
//       comment_count: 2,
//       version: postData.version + 1,
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString()
//     };
//   },
//   deletePost: async (postId: string) => {
//     // This would be replaced with actual API call
//     return;
//   },
//   getPost: async (postId: string) => {
//     // This would be replaced with actual API call
//     return {
//       id: postId,
//       user_id: '1',
//       user_role: 'user' as any,
//       title: 'Sample Post',
//       content: 'This is a sample post content',
//       tags: ['sample', 'post'],
//       mentions: [],
//       images: [],
//       like_count: 10,
//       comment_count: 5,
//       version: 1,
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString()
//     };
//   },
//   likePost: async (postId: string) => {
//     // This would be replaced with actual API call
//     return;
//   },
//   unlikePost: async (postId: string) => {
//     // This would be replaced with actual API call
//     return;
//   },
//   getPublicFeed: async (pagination?: PaginationQuery) => {
//     // This would be replaced with actual API call
//     return Array(10).fill(0).map((_, index) => ({
//       id: (index + 1).toString(),
//       user_id: Math.floor(Math.random() * 5 + 1).toString(),
//       user_role: 'user' as any,
//       title: `Public Post ${index + 1}`,
//       content: `This is public post ${index + 1} content`,
//       tags: ['public', `post${index + 1}`],
//       mentions: [],
//       images: [],
//       like_count: Math.floor(Math.random() * 100),
//       comment_count: Math.floor(Math.random() * 20),
//       version: 1,
//       created_at: new Date(Date.now() - Math.random() * 10000000).toISOString(),
//       updated_at: new Date(Date.now() - Math.random() * 1000000).toISOString()
//     }));
//   },
//   getUserFeed: async (pagination?: PaginationQuery) => {
//     // This would be replaced with actual API call
//     return Array(10).fill(0).map((_, index) => ({
//       id: (index + 1).toString(),
//       user_id: Math.floor(Math.random() * 5 + 1).toString(),
//       user_role: 'user' as any,
//       title: `User Feed Post ${index + 1}`,
//       content: `This is user feed post ${index + 1} content`,
//       tags: ['feed', `post${index + 1}`],
//       mentions: [],
//       images: [],
//       like_count: Math.floor(Math.random() * 100),
//       comment_count: Math.floor(Math.random() * 20),
//       version: 1,
//       created_at: new Date(Date.now() - Math.random() * 10000000).toISOString(),
//       updated_at: new Date(Date.now() - Math.random() * 1000000).toISOString()
//     }));
//   },
//   getUserPosts: async (userId: string, pagination?: PaginationQuery) => {
//     // This would be replaced with actual API call
//     return Array(5).fill(0).map((_, index) => ({
//       id: (index + 1).toString(),
//       user_id: userId,
//       user_role: 'user' as any,
//       title: `User ${userId} Post ${index + 1}`,
//       content: `This is user ${userId} post ${index + 1} content`,
//       tags: ['user', `post${index + 1}`],
//       mentions: [],
//       images: [],
//       like_count: Math.floor(Math.random() * 100),
//       comment_count: Math.floor(Math.random() * 20),
//       version: 1,
//       created_at: new Date(Date.now() - Math.random() * 10000000).toISOString(),
//       updated_at: new Date(Date.now() - Math.random() * 1000000).toISOString()
//     }));
//   },
//   getTrendingPosts: async (pagination?: PaginationQuery) => {
//     // This would be replaced with actual API call
//     return Array(10).fill(0).map((_, index) => ({
//       id: (index + 1).toString(),
//       user_id: Math.floor(Math.random() * 5 + 1).toString(),
//       user_role: 'user' as any,
//       title: `Trending Post ${index + 1}`,
//       content: `This is trending post ${index + 1} content`,
//       tags: ['trending', `post${index + 1}`],
//       mentions: [],
//       images: [],
//       like_count: Math.floor(Math.random() * 1000 + 500),
//       comment_count: Math.floor(Math.random() * 200 + 50),
//       version: 1,
//       created_at: new Date(Date.now() - Math.random() * 10000000).toISOString(),
//       updated_at: new Date(Date.now() - Math.random() * 1000000).toISOString()
//     }));
//   },
//   searchPosts: async (query: string, pagination?: PaginationQuery) => {
//     // This would be replaced with actual API call
//     return Array(5).fill(0).map((_, index) => ({
//       id: (index + 1).toString(),
//       user_id: Math.floor(Math.random() * 5 + 1).toString(),
//       user_role: 'user' as any,
//       title: `Search Result ${index + 1} for "${query}"`,
//       content: `This is search result ${index + 1} for "${query}" content`,
//       tags: ['search', query, `result${index + 1}`],
//       mentions: [],
//       images: [],
//       like_count: Math.floor(Math.random() * 100),
//       comment_count: Math.floor(Math.random() * 20),
//       version: 1,
//       created_at: new Date(Date.now() - Math.random() * 10000000).toISOString(),
//       updated_at: new Date(Date.now() - Math.random() * 1000000).toISOString()
//     }));
//   }
// };

interface PostState {
  currentPost: Post | null;
  publicFeed: Post[];
  userFeed: Post[];
  userPosts: Post[];
  trendingPosts: Post[];
  searchResults: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  currentPost: null,
  publicFeed: [],
  userFeed: [],
  userPosts: [],
  trendingPosts: [],
  searchResults: [],
  loading: false,
  error: null,
};

// createAsyncThunk<Return type(success), Input type(arg pass to thunk), Config(err type) >

export const fetchPublicFeed = createAsyncThunk<Post[], PaginationQuery | undefined, { rejectValue: string }>(
  'post/fetchPublicFeed',
  async (pagination: PaginationQuery | undefined = undefined, {rejectWithValue}) => {
    try {
      const response = await postService.getPublicFeed(pagination);

      const flattenedPosts: Post[] = response.map((pws) => ({
        ...pws.post,
        username: pws.username.split("_").join(" "),
        likedByUser: pws.liked_by_user,
      }))
      console.log('postSlicePublic: ', flattenedPosts)
      return flattenedPosts
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch public feed');
    }
  }
);

export const fetchUserFeed = createAsyncThunk<Post[], PaginationQuery, { rejectValue: string }>(
  'post/fetchUserFeed',
  async (pagination: PaginationQuery, {rejectWithValue}) => {
    try {
      const response = await postService.getUserFeed(pagination)

      // flatten posts data
      const flattenedPosts: Post[] = response.map((pws) => ({
        ...pws.post,
        username: pws.username.split("_").join(" "),
        likedByUser: pws.liked_by_user,
      }))
      console.log('postSlice: ', flattenedPosts)
      return flattenedPosts;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user feed');
    }
  }
);

export const fetchPostById = createAsyncThunk<Post, string, { rejectValue: string }>(
  'post/fetchPostById',
  async (postId: string, {rejectWithValue}) => {
    try {
      const response = await postService.getPostById(postId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user posts');
    }
  }
);

export const fetchPostsByUserId = createAsyncThunk<Post[], { userId: string, pagination: PaginationQuery }, {
  rejectValue: string
}>(
  'post/fetchPostsByUserId',
  async ({userId, pagination}: { userId: string; pagination?: PaginationQuery }, {rejectWithValue}) => {
    try {
      const response = await postService.getPostsByUserId(userId, pagination);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user posts');
    }
  }
);

export const fetchPostComments = createAsyncThunk<{ postId: string; comments: CommentWithParentAndUser[] }, string, {
  rejectValue: string
}>(
  'post/fetchPostComments',
  async (postId: string, {rejectWithValue}) => {
    try {
      const comments = await commentService.getCommentsByPostId(postId)

      return {postId, comments}
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch post comments');
    }
  }
);

export const updatePost = createAsyncThunk<Post, { postId: string, postData: UpdatePostPayload }, {
  rejectValue: string
}>(
  'post/updatePost',
  async ({postId, postData}: { postId: string; postData: UpdatePostPayload }, {rejectWithValue}) => {
    try {
      const response = await postService.updatePost(postId, postData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update post');
    }
  }
);

export const toggleLike = createAsyncThunk<string, string, { rejectValue: string }>(
  'post/toggleLike',
  async (postId: string, {rejectWithValue}) => {
    try {
      const likeStatus = await postService.toggleLike(postId);
      return likeStatus;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like post');
    }
  }
);

export const deletePost = createAsyncThunk<string, string, { rejectValue: string }>(
  'post/deletePost',
  async (postId: string, {rejectWithValue}) => {
    try {
      await postService.deletePost(postId);
      return postId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete post');
    }
  }
);

// Fixed: Using a proper type for the parameter
// export const fetchTrendingPosts = createAsyncThunk<Post[], PaginationQuery | undefined, {rejectValue: string}>(
//   'post/fetchTrendingPosts',
//   async (pagination: PaginationQuery | undefined = undefined, {rejectWithValue}) => {
//     try {
//       const response = await postService.getTrendingPosts(pagination);
//       return response;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch trending posts');
//     }
//   }
// );
//
// export const searchPosts = createAsyncThunk<Post[], {query: string, pagination: PaginationQuery}, {rejectValue: string}>(
//   'post/searchPosts',
//   async ({query, pagination}: { query: string; pagination?: PaginationQuery }, {rejectWithValue}) => {
//     try {
//       const response = await postService.searchPosts(query, pagination);
//       return response;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to search posts');
//     }
//   }
// );

const postSlice = createSlice<PostState>({
  name: 'post',
  initialState,
  reducers: {
    clearPostError: (state: PostState) => {
      state.error = null;
    },
    clearSearchResults: (state: PostState) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Public Feed
      .addCase(fetchPublicFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicFeed.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.loading = false;
        state.publicFeed = action.payload;
      })
      .addCase(fetchPublicFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch User Feed
      .addCase(fetchUserFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFeed.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.loading = false;
        state.userFeed = action.payload;
      })
      .addCase(fetchUserFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Post
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action: PayloadAction<Post>) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch User Posts
      .addCase(fetchPostsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostsByUserId.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.loading = false;
        state.userPosts = action.payload;
      })
      .addCase(fetchPostsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Post Comments
      .addCase(fetchPostComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostComments.fulfilled, (state, action: PayloadAction<{
        postId: string;
        comments: CommentWithParentAndUser[]
      }>) => {
        const {postId, comments} = action.payload;
        const post = state.userFeed.find(p => p.id === postId);
        if (post) {
          post.comments = comments
        }
        state.loading = false;
      })
      .addCase(fetchPostComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Post
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.loading = false;
        state.currentPost = action.payload;
        state.userPosts = state.userPosts.map(post =>
          post.id === action.payload.id ? action.payload : post
        );
        state.publicFeed = state.publicFeed.map(post =>
          post.id === action.payload.id ? action.payload : post
        );
        state.userFeed = state.userFeed.map(post =>
          post.id === action.payload.id ? action.payload : post
        );
        state.trendingPosts = state.trendingPosts.map(post =>
          post.id === action.payload.id ? action.payload : post
        );
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Post
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Unlike Post
      .addCase(toggleLike.fulfilled, (state, action: PayloadAction<string>) => {
        const postId = action.payload;
        if (state.currentPost?.id === postId) {
          state.currentPost.like_count = Math.max(0, state.currentPost.like_count - 1);
        }
        state.userPosts = state.userPosts.map(post =>
          post.id === postId ? {...post, like_count: Math.max(0, post.like_count - 1)} : post
        );
        state.publicFeed = state.publicFeed.map(post =>
          post.id === postId ? {...post, like_count: Math.max(0, post.like_count - 1)} : post
        );
        state.userFeed = state.userFeed.map(post =>
          post.id === postId ? {...post, like_count: Math.max(0, post.like_count - 1)} : post
        );
        state.trendingPosts = state.trendingPosts.map(post =>
          post.id === postId ? {...post, like_count: Math.max(0, post.like_count - 1)} : post
        );
      })
      .addCase(deletePost.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        if (state.currentPost?.id === action.payload) {
          state.currentPost = null;
        }
        state.userPosts = state.userPosts.filter(post => post.id !== action.payload);
        state.publicFeed = state.publicFeed.filter(post => post.id !== action.payload);
        state.userFeed = state.userFeed.filter(post => post.id !== action.payload);
        state.trendingPosts = state.trendingPosts.filter(post => post.id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    // Fetch Trending Posts
    // .addCase(fetchTrendingPosts.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // })
    //   .addCase(fetchTrendingPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
    //     state.loading = false;
    //     state.trendingPosts = action.payload;
    //   })
    //   .addCase(fetchTrendingPosts.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload as string;
    //   })
    //   // Search Posts
    //   .addCase(searchPosts.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(searchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
    //     state.loading = false;
    //     state.searchResults = action.payload;
    //   })
    //   .addCase(searchPosts.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload as string;
    //   })

  },
});

export const {clearPostError, clearSearchResults} = postSlice.actions;
export default postSlice.reducer;
