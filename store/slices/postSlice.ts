"use client";

import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {
  Post,
  UpdatePostPayload,
  CursorPaginationQuery, FeedResponse, FlattenedFeedResponse
} from '@/types';
import {postService} from "@/services";

interface FeedSlice {
  posts: Post[];
  cursor: string | undefined;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
}

interface PostState {
  // Feeds
  publicFeed: FeedSlice;
  userFeed: FeedSlice;
  searchFeed: FeedSlice;
  userPostsFeed: FeedSlice;

  // Global
  limit: number;
  currentPost: Post | null;
  selectedUserId: string | null;
  globalLoading: boolean;
  globalError: string | null;
  filterParams: CursorPaginationQuery;
}

const initialFeed: FeedSlice = {
  posts: [],
  cursor: undefined,
  hasMore: true,
  loading: false,
  error: null,
};

const initialState: PostState = {
  publicFeed: {...initialFeed},
  userFeed: {...initialFeed},
  searchFeed: {...initialFeed},
  userPostsFeed: {...initialFeed},

  limit: 5,
  currentPost: null,
  selectedUserId: null,
  globalLoading: false,
  globalError: null,
  filterParams: {},
};

function updateLikeCount(posts: Post[], postId: string, likeStatus: boolean): Post[] {
  return posts.map(post =>
    post.id === postId
      ? {
        ...post,
        like_count: Math.max(0, post.like_count + (likeStatus ? 1 : -1)),
        likedByUser: !post.likedByUser,
      }
      : post
  );
}

// createAsyncThunk<Return type(success), Input type(arg pass to thunk), Config(err type)>
export const fetchPublicFeed = createAsyncThunk<
  FlattenedFeedResponse,
  CursorPaginationQuery | undefined,
  { rejectValue: string }
>(
  'post/fetchPublicFeed',
  async (pagination: CursorPaginationQuery | undefined, {rejectWithValue}) => {
    try {
      const {posts_with_status, next_cursor} = await postService.getPublicFeed(pagination);

      const flattenedPosts: Post[] = posts_with_status?.map((pws) => ({
        ...pws.post,
        username: pws.username.split("_").join(" "),
        likedByUser: pws.liked_by_user,
      }))
      // console.log('postPublic: ', flattenedPosts)
      return {posts: flattenedPosts || [], nextCursor: next_cursor || ''};
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch public feed');
    }
  }
);

export const fetchUserFeed = createAsyncThunk<
  FlattenedFeedResponse,
  CursorPaginationQuery | undefined,
  { rejectValue: string }
>(
  'post/fetchUserFeed',
  async (pagination: CursorPaginationQuery, {rejectWithValue}) => {
    try {
      const {posts_with_status, next_cursor} = await postService.getUserFeed(pagination)

      // flatten posts data
      const flattenedPosts: Post[] = posts_with_status?.map((pws) => ({
        ...pws.post,
        username: pws.username.split("_").join(" "),
        likedByUser: pws.liked_by_user,
      }))
      // console.log('postUser: ', flattenedPosts, 'cursor: ', next_cursor)

      const currentFilter = {...pagination, cursor: undefined, reset: undefined}

      // !!! pass reset flag to reducer and cache existing filter
      return {
        posts: flattenedPosts || [],
        nextCursor: next_cursor || '',
        reset: pagination.reset,
        filter: currentFilter
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user feed');
    }
  }
);

export const fetchSearchFeed = createAsyncThunk<
  FlattenedFeedResponse,
  CursorPaginationQuery,
  { rejectValue: string }
>(
  'post/fetchSearchFeed',
  async (pagination: CursorPaginationQuery, {rejectWithValue}) => {
    try {
      const {posts_with_status, next_cursor} = await postService.searchPosts(pagination);

      // flatten posts data
      const flattenedPosts: Post[] = posts_with_status?.map((pws) => ({
        ...pws.post,
        username: pws.username.split("_").join(" "),
        likedByUser: pws.liked_by_user,
      }))
      // console.log('postSearch: ', flattenedPosts)

      const currentFilter = {...pagination, cursor: undefined, reset: undefined}

      return {
        posts: flattenedPosts || [],
        nextCursor: next_cursor || '',
        reset: pagination.reset,
        filter: currentFilter
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search posts');
    }
  }
);

export const fetchPostsByUserId = createAsyncThunk<
  FlattenedFeedResponse,
  { userId: string, pagination?: CursorPaginationQuery },
  { rejectValue: string }
>(
  'post/fetchPostsByUserId',
  async ({userId, pagination}: { userId: string; pagination?: CursorPaginationQuery }, {rejectWithValue}) => {
    try {
      const {posts_with_status, next_cursor} = await postService.getPostsByUserId(userId, pagination);

      // flatten posts data
      const flattenedPosts: Post[] = posts_with_status?.map((pws) => ({
        ...pws.post,
        username: pws.username.split("_").join(" "),
        likedByUser: pws.liked_by_user,
      }))
      // console.log('postUserId: ', flattenedPosts)

      return {
        posts: flattenedPosts || [],
        nextCursor: next_cursor || '',
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user posts');
    }
  }
);

export const toggleLike = createAsyncThunk<
  { postId: string, likeStatus: boolean },
  string,
  { rejectValue: string }
>(
  'post/toggleLike',
  async (postId: string, {rejectWithValue}) => {
    try {
      const likeStatus = await postService.toggleLike(postId);
      return {postId, likeStatus};
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like post');
    }
  }
);

export const updatePost = createAsyncThunk<
  Post,
  { postId: string, postData: UpdatePostPayload },
  { rejectValue: string }
>(
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

export const deletePost = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
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

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    clearPostError: (state: PostState) => {
      state.globalError = null;
    },
    clearSearchResults: (state: PostState) => {
      state.searchFeed.posts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Public Feed
      .addCase(fetchPublicFeed.pending, (state: PostState) => {
        state.publicFeed.loading = true;
        state.publicFeed.error = null;
      })
      .addCase(fetchPublicFeed.fulfilled, (state: PostState, action: PayloadAction<FlattenedFeedResponse>) => {
        const {posts, nextCursor, reset} = action.payload
        state.publicFeed.posts = posts ?? [];
        state.publicFeed.cursor = nextCursor ?? undefined;
        state.publicFeed.hasMore = !!nextCursor;

        state.publicFeed.error = posts && posts.length > 0
          ? undefined
          : 'No posts found. Please log in to see more posts. ';
        state.publicFeed.loading = false;
      })
      .addCase(fetchPublicFeed.rejected, (state: PostState, action) => {
        state.publicFeed.loading = false;
        state.publicFeed.error = 'No posts found. Please log in to see more posts.';
      })
      // Fetch User Feed
      .addCase(fetchUserFeed.pending, (state: PostState) => {
        state.userFeed.loading = true;
        state.userFeed.error = null;
      })
      .addCase(fetchUserFeed.fulfilled, (state: PostState, action: PayloadAction<FlattenedFeedResponse>) => {
        const {posts, nextCursor, reset, filter} = action.payload;

        if (reset) {
          state.userFeed.posts = posts ?? [];
          state.filterParams = filter;
        } else {
          if (posts && posts.length > 0) {
            // !!! avoid duplicate fetching
            const existingIds = new Set(state.userFeed.posts.map(p => p.id));
            const uniquePosts = posts.filter(p => !existingIds.has(p.id));

            state.userFeed.posts = [...state.userFeed.posts, ...uniquePosts];
          }
        }
        state.userFeed.cursor = nextCursor;
        state.userFeed.hasMore = !!nextCursor;
        state.userFeed.loading = false;
      })
      .addCase(fetchUserFeed.rejected, (state: PostState, action) => {
        state.userFeed.loading = false;
        state.userFeed.error = 'No posts found.';
      })
      // Fetch User Posts
      .addCase(fetchPostsByUserId.pending, (state: PostState) => {
        state.userPostsFeed.loading = true;
        state.userPostsFeed.error = null;
      })
      .addCase(fetchPostsByUserId.fulfilled, (state: PostState, action: PayloadAction<FlattenedFeedResponse>) => {
        const {posts, nextCursor, selectedUserId: userId} = action.payload;
        // rewrite userPostsFeed if hop on a new user profile page
        if (userId !== state.selectedUserId) {
          state.userPostsFeed.posts = posts;
        }

        if (userId === state.selectedUserId && posts && posts.length > 0) {
          // !!! avoid duplicate fetching
          const existingIds = new Set(state.userPostsFeed.posts.map(p => p.id));
          const uniquePosts = posts.filter(p => !existingIds.has(p.id));

          state.userPostsFeed.posts = [...state.userPostsFeed.posts, ...uniquePosts];
        }

        state.userPostsFeed.cursor = nextCursor;
        state.userPostsFeed.hasMore = !!nextCursor;
        state.userPostsFeed.loading = false;
      })
      .addCase(fetchPostsByUserId.rejected, (state: PostState, action) => {
        state.userPostsFeed.loading = false;
        state.userPostsFeed.error = action.payload as string;
      })
      // Fetch Search Feed
      .addCase(fetchSearchFeed.pending, (state: PostState) => {
        state.searchFeed.loading = true;
        state.searchFeed.error = null;
      })
      .addCase(fetchSearchFeed.fulfilled, (state: PostState, action: PayloadAction<FlattenedFeedResponse>) => {
        const {posts, nextCursor, reset, filter} = action.payload;

        if (posts && posts.length > 0) {
          if (reset) {
            state.searchFeed.posts = posts;
            state.filterParams = filter;
          } else {
            // !!! avoid duplicate fetching
            const existingIds = new Set(state.searchFeed.posts.map(p => p.id));
            const uniquePosts = posts.filter(p => !existingIds.has(p.id));

            state.searchFeed.posts = [...state.searchFeed.posts, ...uniquePosts];
          }
        } else {
          state.searchFeed.posts = [];
        }
        state.searchFeed.cursor = nextCursor;
        state.searchFeed.hasMore = !!nextCursor;
        state.searchFeed.loading = false;
      })
      .addCase(fetchSearchFeed.rejected, (state: PostState, action) => {
        state.searchFeed.loading = false;
        state.searchFeed.error = 'No posts found.';
      })
      .addCase(toggleLike.fulfilled, (state: PostState, action: PayloadAction<{
        postId: string;
        likeStatus: boolean
      }>) => {
        const {postId, likeStatus} = action.payload;

        if (state.currentPost?.id === postId) {
          state.currentPost.like_count = Math.max(
            0,
            state.currentPost.like_count + (likeStatus ? 1 : -1)
          );

          state.currentPost.likedByUser = !state.currentPost.likedByUser
        }
        state.userPostsFeed.posts = updateLikeCount(state.userPostsFeed.posts, postId, likeStatus);
        state.publicFeed.posts = updateLikeCount(state.publicFeed.posts, postId, likeStatus);
        state.userFeed.posts = updateLikeCount(state.userFeed.posts, postId, likeStatus);
      })
      .addCase(updatePost.pending, (state: PostState) => {
        state.globalLoading = true;
        state.globalError = null;
      })
      .addCase(updatePost.fulfilled, (state: PostState, action: PayloadAction<Post>) => {
        state.globalLoading = false;
        state.currentPost = action.payload;
        state.userPostsFeed.posts = state.userPostsFeed.posts.map(post =>
          post.id === action.payload.id ? action.payload : post
        );
        state.publicFeed.posts = state.publicFeed.posts.map(post =>
          post.id === action.payload.id ? action.payload : post
        );
        state.userFeed.posts = state.userFeed.posts.map(post =>
          post.id === action.payload.id ? action.payload : post
        );
      })
      .addCase(updatePost.rejected, (state: PostState, action) => {
        state.globalLoading = false;
        state.globalError = action.payload as string;
      })
      // Delete Post
      .addCase(deletePost.pending, (state: PostState) => {
        state.globalLoading = true;
        state.globalError = null;
      })

      .addCase(deletePost.fulfilled, (state: PostState, action: PayloadAction<string>) => {
        state.globalLoading = false;
        if (state.currentPost?.id === action.payload) {
          state.currentPost = null;
        }
        state.userPostsFeed.posts = state.userPostsFeed.posts.filter(post => post.id !== action.payload);
        state.publicFeed.posts = state.publicFeed.posts.filter(post => post.id !== action.payload);
        state.userFeed.posts = state.userFeed.posts.filter(post => post.id !== action.payload);
      })
      .addCase(deletePost.rejected, (state: PostState, action) => {
        state.globalLoading = false;
        state.globalError = action.payload as string;
      })
  },
});

export const {clearPostError, clearSearchResults} = postSlice.actions;
export default postSlice.reducer;
