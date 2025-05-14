"use client";

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, FollowStatus } from '../../types';

// Define the user service interface
interface UserService {
  getUserProfile: (userId: string) => Promise<User>;
  followUser: (userId: string) => Promise<FollowStatus>;
  unfollowUser: (userId: string) => Promise<FollowStatus>;
  getFollowStatus: (userId: string) => Promise<FollowStatus>;
  searchUsers: (query: string) => Promise<User[]>;
}

// Temporary mock implementation
const userService: UserService = {
  getUserProfile: async (userId: string) => {
    // This would be replaced with actual API call
    return {
      id: userId,
      username: `user${userId}`,
      email: `user${userId}@example.com`,
      role: 'user' as any,
      is_active: true,
      profile: {
        bio: 'A user of the platform',
        location: 'Somewhere',
      },
      rating: {
        total_rating: 4.5,
        rating_count: 10
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },
  followUser: async (userId: string) => {
    // This would be replaced with actual API call
    return { isFollowing: true };
  },
  unfollowUser: async (userId: string) => {
    // This would be replaced with actual API call
    return { isFollowing: false };
  },
  getFollowStatus: async (userId: string) => {
    // This would be replaced with actual API call
    return { isFollowing: Math.random() > 0.5 };
  },
  searchUsers: async (query: string) => {
    // This would be replaced with actual API call
    return [1, 2, 3].map(id => ({
      id: id.toString(),
      username: `user${id}`,
      email: `user${id}@example.com`,
      role: 'user' as any,
      is_active: true,
      profile: {
        bio: `User ${id} bio`,
        location: 'Somewhere',
      },
      rating: {
        total_rating: 4.5,
        rating_count: 10
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
  }
};

interface UserState {
  currentProfile: User | null;
  followStatus: boolean;
  searchResults: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentProfile: null,
  followStatus: false,
  searchResults: [],
  loading: false,
  error: null,
};

export const getUserProfile = createAsyncThunk<User, string, {rejectValue: string}>(
  'user/getUserProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await userService.getUserProfile(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user profile');
    }
  }
);

export const followUser = createAsyncThunk<FollowStatus, string, {rejectValue: string}>(
  'user/followUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await userService.followUser(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to follow user');
    }
  }
);

export const unfollowUser = createAsyncThunk<FollowStatus, string, {rejectValue: string}>(
  'user/unfollowUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await userService.unfollowUser(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unfollow user');
    }
  }
);

export const getFollowStatus = createAsyncThunk<FollowStatus, string, {rejectValue: string}>(
  'user/getFollowStatus',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await userService.getFollowStatus(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get follow status');
    }
  }
);

export const searchUsers = createAsyncThunk<User[], string, {rejectValue: string}>(
  'user/searchUsers',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await userService.searchUsers(query);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search users');
    }
  }
);

const userSlice = createSlice<UserState>({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state: UserState) => {
      state.error = null;
    },
    clearSearchResults: (state: UserState) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get User Profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.currentProfile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Follow User
      .addCase(followUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state, action: PayloadAction<FollowStatus>) => {
        state.loading = false;
        state.followStatus = action.payload.isFollowing;
      })
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Unfollow User
      .addCase(unfollowUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unfollowUser.fulfilled, (state, action: PayloadAction<FollowStatus>) => {
        state.loading = false;
        state.followStatus = action.payload.isFollowing;
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Follow Status
      .addCase(getFollowStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFollowStatus.fulfilled, (state, action: PayloadAction<FollowStatus>) => {
        state.loading = false;
        state.followStatus = action.payload.isFollowing;
      })
      .addCase(getFollowStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Search Users
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUserError, clearSearchResults } = userSlice.actions;
export default userSlice.reducer;
