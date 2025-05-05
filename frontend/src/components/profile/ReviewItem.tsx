import React from 'react';
import { Link } from 'react-router-dom';
import { Review } from '@/types';

interface ReviewItemProps {
  review: Review;
}

const ReviewItem = ({ review }: ReviewItemProps) => {
  return (
    <div className="border border-black grid grid-cols-3">
      <div className="p-4 border-r border-black">
        <Link to={`/profile/${review.authorId}`} className="hover:underline">
          <p>{review.authorName}</p>
        </Link>
      </div>
      <div className="p-4 col-span-2 flex justify-between">
        <p>{review.text}</p>
        <div className="flex items-center">
          <span className="text-yellow-500 text-2xl">★</span>
          <span className="text-2xl ml-2">{review.rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
