import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createReview } from '../../store/slices/reviewSlice';
import { CreateReviewPayload } from '../../types';

interface ReviewFormProps {
  ratedUserId: string;
  onSuccess?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ ratedUserId, onSuccess }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state: any) => state.review);
  
  const [score, setScore] = useState<number>(5);
  const [comment, setComment] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const reviewData: CreateReviewPayload = {
      rated_user_id: ratedUserId,
      score,
      comment,
    };
    
    dispatch(createReview(reviewData))
      .unwrap()
      .then(() => {
        setScore(5);
        setComment('');
        if (onSuccess) onSuccess();
      })
      .catch((err) => {
        console.error('Failed to create review:', err);
      });
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Leave a Review</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="score" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Rating
          </label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setScore(value)}
                className="text-2xl focus:outline-none"
              >
                <span className={value <= score ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}>★</span>
              </button>
            ))}
            <span className="ml-2 text-gray-700 dark:text-gray-300">{score} out of 5</span>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Comment
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Write your review here..."
            rows={4}
            required
          />
        </div>
        
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
