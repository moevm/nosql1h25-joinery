import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useApp } from '@/hooks/useApp';
import UserProfileHeader from '@/components/profile/UserProfileHeader';
import UserInfo from '@/components/profile/UserInfo';
import ReviewsList from '@/components/profile/ReviewsList';
import { formatDate } from '@/utils/formatters';

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, getUserById, getUserReviews, addReview, getUserListings } = useApp();
  
  const profileUser = getUserById(id || '');
  const reviews = getUserReviews(id || '');
  const listings = getUserListings(id || '');
  
  // For debugging
  console.log('Profile ID from URL:', id);
  console.log('Retrieved profile user:', profileUser);
  
  if (!profileUser) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto p-4">
          <p>Пользователь не найден</p>
          <Link to="/" className="underline">На главную</Link>
        </div>
      </div>
    );
  }

  const isCurrentUser = currentUser && currentUser.id === profileUser.id;

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
          />
          
          {/* Right column - Reviews */}
          <ReviewsList 
            reviews={reviews}
            currentUser={currentUser}
            profileUser={profileUser}
            addReview={addReview}
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
