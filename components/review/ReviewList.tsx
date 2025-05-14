import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Review } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { deleteReview } from '../../store/slices/reviewSlice';

interface ReviewListProps {
  reviews: Review[];
  loading?: boolean;
  error?: string | null;
  showActions?: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({ 
  reviews, 
  loading = false, 
  error = null,
  showActions = false
}) => {
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state: any) => state.auth);
  
  const handleDelete = (reviewId: string, ratedUserId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      dispatch(deleteReview({ reviewId, ratedUserId }));
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }
  
  if (reviews.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          {/* Review Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold text-xs">
                {review.rater_username.substring(0, 2).toUpperCase()}
              </div>
              <div className="ml-2">
                <span className="font-medium text-gray-900 dark:text-white">{review.rater_username}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
            
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <span 
                  key={index} 
                  className={`text-lg ${index < review.score ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          
          {/* Review Content */}
          <p className="text-gray-700 dark:text-gray-300 mb-2">{review.comment}</p>
          
          {/* Review Actions */}
          {showActions && currentUser && currentUser.id === review.rater_id && (
            <div className="flex justify-end">
              <button
                onClick={() => handleDelete(review.id, review.rated_user_id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
