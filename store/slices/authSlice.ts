"use client";

import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User, UserWithStats} from '@/types';
import {logoutAction} from "@/app/actions/logoutAction";
import {authService} from "@/services";

interface AuthState {
  user: User | null;
  postCount: number;
  followerCount: number;
  followingCount: number;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  postCount: 0,
  followerCount: 0,
  followingCount: 0,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const getCurrentUser = createAsyncThunk<UserWithStats, void, { rejectValue: string }>(
  'auth/getCurrentUser',
  async (_, {rejectWithValue}) => {
    try {
      return await authService.getCurrentUser();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Not authenticated');
    }
  }
);

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, {rejectWithValue}) => {
    try {
      // using server-side action
      await logoutAction();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state: AuthState) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Current User
      .addCase(getCurrentUser.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state: AuthState, action: PayloadAction<UserWithStats>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.postCount = action.payload.post_count;
        state.followerCount = action.payload.following_count;
        state.followingCount = action.payload.following_count;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state: AuthState, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state: AuthState) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const {clearError} = authSlice.actions;
export default authSlice.reducer;
