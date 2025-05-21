
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useApp } from '@/hooks/useApp';
import UserProfileHeader from '@/components/profile/UserProfileHeader';
import UserInfo from '@/components/profile/UserInfo';
import ReviewsList from '@/components/profile/ReviewsList';
import { formatDate } from '@/utils/formatters';
import { User, Review } from '@/types';

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, getUserById, getUserReviews, addReview, getUserListings } = useApp();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Загружаем данные пользователя
  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const user = await getUserById(id);
        if (user) {
          setProfileUser(user);
          
          // Загружаем отзывы о пользователе
          const userReviews = await getUserReviews(id);
          setReviews(userReviews);
        } else {
          setError('Пользователь не найден');
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
        setError('Ошибка при загрузке данных пользователя');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [id, getUserById, getUserReviews]);
  
  // Для отладки
  console.log('Profile ID from URL:', id);
  console.log('Retrieved profile user:', profileUser);
  
  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto p-4 flex items-center justify-center">
          <p className="text-2xl">Загрузка...</p>
        </div>
      </div>
    );
  }
  
  if (error || !profileUser) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto p-4">
          <p>{error || 'Пользователь не найден'}</p>
          <Link to="/" className="underline">На главную</Link>
        </div>
      </div>
    );
  }

  const isCurrentUser = currentUser && currentUser.id === profileUser.id;
  const listings = getUserListings(profileUser.id);
  
  // Обработчик добавления отзыва
  const handleAddReview = (userId: string, text: string, rating: number) => {
    console.log(`Handling add review for user ${userId}, login: ${profileUser.login}, rating: ${rating}`);
    
    // Здесь мы должны использовать login пользователя, а не id
    addReview(profileUser.login, text, rating);
    
    // Обновляем список отзывов после добавления нового
    getUserReviews(userId).then(updatedReviews => {
      setReviews(updatedReviews);
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto p-4">
        <UserProfileHeader 
          userType={profileUser.userType} 
          isCurrentUser={isCurrentUser} 
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - User info */}
          <UserInfo 
            profileUser={profileUser}
            formatDate={formatDate}
            reviews={reviews}
          />
          
          {/* Right column - Reviews */}
          <ReviewsList 
            reviews={reviews}
            currentUser={currentUser}
            profileUser={profileUser}
            addReview={handleAddReview}
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
