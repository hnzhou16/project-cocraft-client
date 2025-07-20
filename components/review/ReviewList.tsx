import React, {useEffect} from 'react';
import {formatDistanceToNow} from 'date-fns';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {deleteReview, fetchUserReviews} from '@/store/slices/reviewSlice';
import {button, cn, typography, ui} from "@/utils/classnames";
import Link from "next/link";

interface ReviewListProps {
  userId: string;
}

const ReviewList: React.FC<ReviewListProps> = ({userId}) => {

  const dispatch = useAppDispatch();

  const {user: authUser} = useAppSelector(state => state.auth);
  const {reviews, loading, error} = useAppSelector(state => state.review );

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserReviews(userId))
    }
  }, [dispatch, userId]);

  const handleDelete = (reviewId: string, ratedUserId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      dispatch(deleteReview({reviewId, ratedUserId}));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className={ui.busy}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-secondary-background rounded-lg p-6 text-center relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-secondary-background rounded-lg p-6 text-center">
        <p className={typography.h4}>No reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-primary-background rounded-lg shadow-sm p-4">
          {/* Review Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div
                className={cn(ui.avatar.base, ui.avatar.sm)}>
                {review.rater_username.substring(0, 1).toUpperCase()}
              </div>
              <div className="ml-2">
                <Link
                  href={`/profile/${review.rater_id}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {review.rater_username.split('_').join(' ')}
                </Link>
                <p className="text-xs text-secondary-foreground">
                  {formatDistanceToNow(new Date(review.created_at), {addSuffix: true})}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              {Array.from({length: 5}).map((_, index) => (
                <span
                  key={index}
                  className={`text-lg ${index < review.score ? 'text-accent' : 'text-secondary-background'}`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Review Content */}
          <p className={typography.p1}>{review.comment}</p>

          {/* Delete Review */}
          {authUser && authUser.id === review.rater_id && (
            <div className="flex justify-end">
              <button
                onClick={() => handleDelete(review.id, review.rated_user_id)}
                className={button.ghost}
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
