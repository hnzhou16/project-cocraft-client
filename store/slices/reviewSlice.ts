"use client";

import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {Review, CreateReviewPayload} from '@/types';
import {reviewService} from "@/services";

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

export const fetchUserReviews = createAsyncThunk<Review[], string, { rejectValue: string }>(
  'review/fetchUserReviews',
  async (userId: string, {rejectWithValue}) => {
    try {
      const response = await reviewService.getUserReviews(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user reviews');
    }
  }
);

export const createReview = createAsyncThunk<Review, CreateReviewPayload, { rejectValue: string }>(
  'review/createReview',
  async (reviewData: CreateReviewPayload, {rejectWithValue}) => {
    try {
      const response = await reviewService.createReview(reviewData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create review');
    }
  }
);

export const deleteReview = createAsyncThunk<string, {reviewId: string, ratedUserId: string}, { rejectValue: string }>(
  'review/deleteReview',
  async ({reviewId, ratedUserId}, {rejectWithValue}) => {
    try {
      await reviewService.deleteReview(reviewId, ratedUserId);
      return reviewId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);

const reviewSlice = createSlice<ReviewState>({
  name: 'review',
  initialState,
  reducers: {
    clearReviewError: (state: ReviewState) => {
      state.error = null;
    },
    clearReviews: (state: ReviewState) => {
      state.reviews = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get User Reviews
      .addCase(fetchUserReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserReviews.fulfilled, (state, action: PayloadAction<Review[]>) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
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

export const {clearReviewError, clearReviews} = reviewSlice.actions;
export default reviewSlice.reducer;
