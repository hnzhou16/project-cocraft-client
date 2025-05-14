"use client";

import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RegisterPayload, User, UserWithStats} from '@/types';
import authService from '../../services/authService';
import {logoutAction} from "@/app/actions/logoutAction";

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

export const register = createAsyncThunk<User, RegisterPayload, {rejectValue: string}>(
  'auth/register',
  async (userData: RegisterPayload, { rejectWithValue }) => {
    try {
      await authService.register(userData);
      return await authService.getCurrentUser();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk<UserWithStats, void, { rejectValue: string}>(
  'auth/getCurrentUser', 
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getCurrentUser();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Not authenticated');
    }
  }
);

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // using server-side action
      await logoutAction();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);


const authSlice = createSlice<AuthState>({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state: AuthState) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<UserWithStats>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.postCount = action.payload.post_count;
        state.followerCount = action.payload.following_count;
        state.followingCount = action.payload.following_count;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
