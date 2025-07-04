// Temporary mock implementation
import {CreateReviewPayload} from "@/types";

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