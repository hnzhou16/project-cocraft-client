"use client";

import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {User, FollowStatus, UserWithStats} from '@/types';
import {userService} from "@/services";

interface UserState {
  selectedProfile: UserWithStats | null;
  isFollowing: boolean;
  loading: boolean;
  error: string | null;
}

const initialProfile: UserWithStats = {
  user: null,
  post_count: undefined,
  following_count: undefined,
  follower_count: undefined,
};

const initialState: UserState = {
  selectedProfile: initialProfile,
  isFollowing: false,
  loading: false,
  error: null,
};

export const getUserProfile = createAsyncThunk<UserWithStats, string, { rejectValue: string }>(
  'user/getUserProfile',
  async (userId: string, {rejectWithValue}) => {
    try {
      const response = await userService.getUserById(userId);
      // console.log(response)
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user profile');
    }
  }
);

export const followUser = createAsyncThunk<boolean, string, { rejectValue: string }>(
  'user/followUser',
  async (userId: string, {rejectWithValue}) => {
    try {
      const response = await userService.followUser(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to follow user');
    }
  }
);

export const unfollowUser = createAsyncThunk<boolean, string, { rejectValue: string }>(
  'user/unfollowUser',
  async (userId: string, {rejectWithValue}) => {
    try {
      const response = await userService.unfollowUser(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unfollow user');
    }
  }
);

export const getFollowStatus = createAsyncThunk<boolean, string, { rejectValue: string }>(
  'user/getFollowStatus',
  async (userId: string, {rejectWithValue}) => {
    try {
      const response = await userService.getFollowStatus(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get follow status');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state: UserState) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get User Profile: UserState
      .addCase(getUserProfile.pending, (state: UserState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state: UserState, action: PayloadAction<UserWithStats>) => {
        state.loading = false;
        state.selectedProfile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state: UserState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Follow User
      .addCase(followUser.pending, (state: UserState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state: UserState, action: PayloadAction<boolean>) => {
        state.loading = false;
        state.isFollowing = action.payload;
      })
      .addCase(followUser.rejected, (state: UserState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Unfollow User
      .addCase(unfollowUser.pending, (state: UserState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unfollowUser.fulfilled, (state: UserState, action: PayloadAction<boolean>) => {
        state.loading = false;
        state.isFollowing = action.payload;
      })
      .addCase(unfollowUser.rejected, (state: UserState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Follow Status
      .addCase(getFollowStatus.pending, (state: UserState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFollowStatus.fulfilled, (state: UserState, action: PayloadAction<boolean>) => {
        state.loading = false;
        state.isFollowing = action.payload;
      })
      .addCase(getFollowStatus.rejected, (state: UserState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export const {clearUserError} = userSlice.actions;
export default userSlice.reducer;
