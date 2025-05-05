import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/hooks/useApp';
import { Comment } from '@/types';

interface CommentsProps {
  listingId: string;
  comments: Comment[];
}

const Comments = ({ listingId, comments }: CommentsProps) => {
  const { user, addComment } = useApp();
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(listingId, newComment);
      setNewComment('');
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl mb-4">Комментарии</h3>
      
      <div className="mb-8">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="border border-black mb-2 grid grid-cols-3">
              <div className="p-4 border-r border-black">
                <Link to={`/profile/${comment.userId}`} className="hover:underline">
                  <p>{comment.userName}</p>
                </Link>
              </div>
              <div className="p-4 col-span-2">
                <p>{comment.text}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Нет комментариев</p>
        )}
      </div>
      
      {user && (
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border border-black p-4 h-32 resize-none"
            placeholder="Напишите комментарий..."
          />
          <button 
            type="submit" 
            className="border border-black px-4 py-2 absolute bottom-4 right-4 bg-white hover:bg-gray-50"
            disabled={!newComment.trim()}
          >
            Оставить комментарий
          </button>
        </form>
      )}
    </div>
  );
};

export default Comments;
