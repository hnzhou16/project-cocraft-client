"use client";

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Review, CreateReviewPayload } from '../../types';

// Define the review service interface
interface ReviewService {
  getUserReviews: (userId: string) => Promise<Review[]>;
  createReview: (reviewData: CreateReviewPayload) => Promise<Review>;
  deleteReview: (reviewId: string) => Promise<void>;
}

// Temporary mock implementation
const reviewService: ReviewService = {
  getUserReviews: async (userId: string) => {
    // This would be replaced with actual API call
    return Array(3).fill(0).map((_, index) => ({
      id: (index + 1).toString(),
      rated_user_id: userId,
      rater_id: Math.floor(Math.random() * 5 + 1).toString(),
      rater_username: `user${Math.floor(Math.random() * 5 + 1)}`,
      score: Math.floor(Math.random() * 5 + 1),
      comment: `This is review ${index + 1} for user ${userId}`,
      created_at: new Date(Date.now() - Math.random() * 10000000).toISOString(),
    }));
  },
  createReview: async (reviewData: CreateReviewPayload) => {
    // This would be replaced with actual API call
    return {
      id: Math.random().toString(36).substring(7),
      rated_user_id: reviewData.rated_user_id,
      rater_id: '1',
      rater_username: 'Current User',
      score: reviewData.score,
      comment: reviewData.comment,
      created_at: new Date().toISOString(),
    };
  },
  deleteReview: async (reviewId: string) => {
    // This would be replaced with actual API call
    return;
  }
};

interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
};

export const getUserReviews = createAsyncThunk(
  'review/getUserReviews',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await reviewService.getUserReviews(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user reviews');
    }
  }
);

export const createReview = createAsyncThunk(
  'review/createReview',
  async (reviewData: CreateReviewPayload, { rejectWithValue }) => {
    try {
      const response = await reviewService.createReview(reviewData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create review');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'review/deleteReview',
  async (reviewId: string, { rejectWithValue }) => {
    try {
      await reviewService.deleteReview(reviewId);
      return reviewId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    clearReviewError: (state) => {
      state.error = null;
    },
    clearReviews: (state) => {
      state.reviews = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get User Reviews
      .addCase(getUserReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserReviews.fulfilled, (state, action: PayloadAction<Review[]>) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(getUserReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.loading = false;
        state.reviews = [action.payload, ...state.reviews];
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.reviews = state.reviews.filter(review => review.id !== action.payload);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearReviewError, clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
