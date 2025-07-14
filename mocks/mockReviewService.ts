import {CreateReviewPayload, Review} from "@/types";

// Mock implementation that reflects the latest API structure
const mockReviewService = {
  // Create a new review
  createReview: async (reviewData: CreateReviewPayload): Promise<Review> => {
    console.log('Mock: Creating review', reviewData);
    return {
      id: Math.random().toString(36).substring(7),
      rated_user_id: reviewData.rated_user_id,
      rater_id: 'current_user_id',
      rater_username: 'current_user',
      score: reviewData.score,
      comment: reviewData.comment,
      created_at: new Date().toISOString(),
    };
  },

  // Get user reviews
  getUserReviews: async (userId: string): Promise<Review[]> => {
    return Array(Math.floor(Math.random() * 8 + 3)).fill(0).map((_, index) => ({
      id: (index + 1).toString(),
      rated_user_id: userId,
      rater_id: Math.floor(Math.random() * 10 + 1).toString(),
      rater_username: `reviewer${Math.floor(Math.random() * 10 + 1)}`,
      score: Math.floor(Math.random() * 5 + 1), // 1-5 stars
      comment: [
        'Great work quality and professional service!',
        'Very satisfied with the results. Highly recommended.',
        'Good communication and timely delivery.',
        'Excellent attention to detail.',
        'Professional and reliable contractor.',
        'Outstanding craftsmanship and fair pricing.',
        'Would definitely work with them again.',
        'Exceeded expectations in every way.',
        'Responsive and easy to work with.',
        'Quality work completed on schedule.'
      ][Math.floor(Math.random() * 10)],
      created_at: new Date(Date.now() - Math.random() * 31536000000).toISOString(), // Random date within last year
    }));
  },

  // Delete a review
  deleteReview: async (reviewId: string, ratedUserId: string): Promise<void> => {
    console.log('Mock: Deleting review', reviewId, 'for user', ratedUserId);
    return;
  },
};

export default mockReviewService;
