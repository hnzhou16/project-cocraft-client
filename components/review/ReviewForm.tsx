import React, {useActionState, useState} from 'react';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {createReview} from '@/store/slices/reviewSlice';
import {CreateReviewPayload} from '@/types';
import {button, form, typography} from "@/utils/classnames";

interface ReviewFormProps {
  ratedUserId: string;
  onSuccess?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ratedUserId, onSuccess}) => {
  const dispatch = useAppDispatch();
  const {loading, error} = useAppSelector((state: any) => state.review);

  const [score, setScore] = useState<number>(5);
  const [hovered, setHovered] = useState<number | null>(null); // temporary hover state
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
    <div className="bg-background rounded-lg shadow-md p-6">
      <p className={typography.h3}>Leave a Review</p>

      {error && (
        <div className="bg-secondary-background rounded-lg p-6 text-center relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="score" className="block text-secondary-foreground text-sm font-bold mb-2">
            Rating
          </label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onMouseEnter={() => setHovered(value)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setScore(value)} // keep click to confirm selection
                className="text-2xl focus:outline-none"
              >
                <span className={value <= (hovered ?? score) ? 'text-accent' : 'text-secondary-background'}>★</span>
              </button>
            ))}
            <span className="ml-2 text-primary-foreground">{hovered ?? score} out of 5</span>
          </div>
        </div>

        <div className="">
          <label htmlFor="comment" className="block text-primary-foreground text-sm font-bold mb-2">
            Comment
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={form.textarea}
            placeholder="Write your review here..."
            rows={4}
            required
          />
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={loading}
            className={loading ? button.secondary : button.primary}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
