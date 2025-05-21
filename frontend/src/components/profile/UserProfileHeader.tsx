
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface UserProfileHeaderProps {
  userType: string;
  isCurrentUser: boolean;
}

const UserProfileHeader = ({
  userType,
  isCurrentUser
}: UserProfileHeaderProps) => {
  const navigate = useNavigate();
  
  // Определяем тип пользователя для отображения
  const displayUserType = userType === 'master' ? 'Продавец' : userType;
  
  // Check if the user is a seller/master type that can create listings
  const canCreateListings = userType === 'Продавец' || userType === 'master';
  
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-5xl">{displayUserType}</h1>
      <div className="flex gap-4">
        {isCurrentUser && (
          <Link 
            to="/edit-profile" 
            className="border border-black px-6 py-2 bg-white hover:bg-gray-50 inline-block text-black"
          >
            Редактировать профиль
          </Link>
        )}
        
        {/* Only show Create Listing button for sellers/masters */}
        {isCurrentUser && canCreateListings && (
          <Link 
            to="/create" 
            className="border border-black px-6 py-2 bg-white hover:bg-gray-50 inline-block text-black"
          >
            Создать объявление
          </Link>
        )}
      </div>
    </div>
  );
};

export default UserProfileHeader;
