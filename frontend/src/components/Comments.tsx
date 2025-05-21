
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/hooks/useApp';
import { Comment } from '@/types';
import { apiService } from '@/services/api';

interface CommentsProps {
  listingId: string;
  comments: Comment[];
}

const Comments = ({ listingId, comments: initialComments }: CommentsProps) => {
  const { user, addComment } = useApp();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isLoading, setIsLoading] = useState(false);
  const commentsLoaded = useRef(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (listingId && !commentsLoaded.current) {
          setIsLoading(true);
          // Extract masterId and number from listingId
          const [masterId, numberStr] = listingId.split('_');
          const number = parseInt(numberStr);
          
          console.log(`Fetching comments for listing ${masterId}/${number}`);
          const fetchedComments = await apiService.getListingComments(masterId, number);
          console.log('Fetched comments:', fetchedComments);
          setComments(fetchedComments);
          commentsLoaded.current = true;
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [listingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        const [masterId, numberStr] = listingId.split('_');
        const number = parseInt(numberStr);
        
        // Add the comment through API
        await addComment(listingId, newComment);
        
        // Optimistically add the comment to the local state
        if (user) {
          const newCommentObj: Comment = {
            id: `${user.id}_${Date.now()}`,
            listingId,
            userId: user.id,
            userName: user.fullName,
            text: newComment,
            createdAt: new Date().toISOString()
          };
          
          setComments(prev => [...prev, newCommentObj]);
        }
        
        setNewComment('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl mb-4">Комментарии</h3>
      
      {isLoading ? (
        <p>Загрузка комментариев...</p>
      ) : (
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
      )}
      
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
