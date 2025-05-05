import React from 'react';
import { Button } from '@/components/ui/button';

interface ReviewFormProps {
  reviewText: string;
  setReviewText: (text: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

const ReviewForm = ({ reviewText, setReviewText, onCancel, onSubmit }: ReviewFormProps) => {
  return (
    <div className="mt-6 border border-black p-4">
      <h3 className="text-xl mb-2">Новый отзыв</h3>
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
          disabled={!reviewText.trim()}
        >
          Отправить
        </Button>
      </div>
    </div>
  );
};

export default ReviewForm;
