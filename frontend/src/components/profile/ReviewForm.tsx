
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ReviewFormProps {
  reviewText: string;
  setReviewText: (text: string) => void;
  rating: number;
  setRating: (rating: number) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

const ReviewForm = ({ 
  reviewText, 
  setReviewText, 
  rating, 
  setRating, 
  onCancel, 
  onSubmit 
}: ReviewFormProps) => {
  return (
    <div className="mt-6 border border-black p-4">
      <h3 className="text-xl mb-2">Новый отзыв</h3>
      
      <div className="mb-4">
        <label className="block mb-1">Оценка:</label>
        <div className="flex space-x-4">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`text-2xl ${rating >= value ? 'text-yellow-500' : 'text-gray-300'}`}
            >
              ★
            </button>
          ))}
          <span className="ml-2">{rating} из 5</span>
        </div>
      </div>
      
      <textarea 
        className="w-full h-32 border border-black p-2 mb-4"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Введите текст отзыва"
      />
      <div className="flex justify-end space-x-4">
        <Button 
          onClick={onCancel}
          className="border border-black px-6 py-2 bg-white hover:bg-gray-50 text-black"
          variant="outline"
        >
          Отмена
        </Button>
        <Button 
          onClick={onSubmit}
          className="border border-black px-6 py-2 bg-white hover:bg-gray-50 text-black"
          variant="outline"
          disabled={!reviewText.trim() || rating === 0}
        >
          Отправить
        </Button>
      </div>
    </div>
  );
};

export default ReviewForm;
