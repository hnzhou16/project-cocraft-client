import { apiCall } from '@/utils/apiUtils';
import { CreateReviewPayload, Review } from '@/types';

export const reviewService = {
  // Create a new review
  createReview: async (reviewData: CreateReviewPayload): Promise<Review> => {
    return apiCall<Review>('POST', '/review/create-review', reviewData);
  },

  getUserReviews: async (userId: string): Promise<Review[]> => {
    return apiCall<Review[]>('GET', `/user/${userId}/reviews`);
},

  // Delete a review
  deleteReview: async (reviewId: string, ratedUserId: string): Promise<void> => {
    return apiCall<void>('DELETE', `/review/${reviewId}/delete-review`, { rated_user_id: ratedUserId });
  },
};

export default reviewService;
