"use client";

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, Role, LoginPayload, RegisterPayload, AuthResponse } from '../../types';
import authService from '../../services/authService';
import { apiRequest } from '../../services/api';
import { decodeJWT } from '../../utils/apiUtils';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const login = createAsyncThunk<{user: User, token: string}, LoginPayload, {rejectValue: string}>(
  'auth/login',
  async (credentials: LoginPayload, { rejectWithValue }) => {
    try {
      // Get token from auth service
      const {data} = await authService.login(credentials);

      // Store token
      authService.setToken(data);
      
      // Get user ID from token (you might need to decode JWT)
      const userId = decodeToken(data);
      
      // Get user details
      const user = await authService.getCurrentUser(userId);
      
      return { user, data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk<AuthResponse, RegisterPayload, {rejectValue: string}>(
  'auth/register',
  async (userData: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      authService.setToken(response.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout', 
  async () => {
    authService.logout();
    return null;
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser', 
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = authService.getToken();
      if (!token) {
        return rejectWithValue('No token found');
      }
      
      const userId = decodeToken(token);
      const user = await authService.getCurrentUser(userId);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get current user');
    }
  }
);

// Helper function to decode JWT token and extract user ID
function decodeToken(token: string): string {
  const decoded = decodeJWT(token);
  return decoded?.user_id || decoded?.sub || '1'; // Fallback to '1' if no ID found
}

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
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
