
import React, { useState } from 'react';
import { Review, User } from '@/types';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';
import { Button } from '@/components/ui/button';

interface ReviewsListProps {
  reviews: Review[];
  currentUser: User | null;
  profileUser: User;
  addReview: (userId: string, text: string, rating: number) => void;
}

const ReviewsList = ({ reviews, currentUser, profileUser, addReview }: ReviewsListProps) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);

  const handleAddReview = () => {
    if (reviewText.trim() && profileUser.id && rating > 0) {
      console.log(`Sending review to user ${profileUser.id}, rating: ${rating}`);
      addReview(profileUser.id, reviewText, rating);
      setReviewText('');
      setRating(5);
      setShowReviewForm(false);
    }
  };

  return (
    <div className="col-span-1 md:col-span-2">
      <h2 className="text-5xl mb-6">Отзывы:</h2>
      
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <p className="mb-4">Отзывов пока нет</p>
      )}
      
      {currentUser && currentUser.id !== profileUser.id && !showReviewForm && (
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={() => setShowReviewForm(true)}
            className="border border-black px-6 py-2 bg-white hover:bg-gray-50 text-black"
            variant="outline"
          >
            Оставить отзыв
          </Button>
        </div>
      )}
      
      {showReviewForm && (
        <ReviewForm 
          reviewText={reviewText}
          setReviewText={setReviewText}
          rating={rating}
          setRating={setRating}
          onCancel={() => setShowReviewForm(false)}
          onSubmit={handleAddReview}
        />
      )}
    </div>
  );
};

export default ReviewsList;
