import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface UserProfileHeaderProps {
  userType: string;
  isCurrentUser: boolean;
}

const UserProfileHeader = ({ userType, isCurrentUser }: UserProfileHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-5xl">{userType}</h1>
      <div className="flex gap-4">
        {isCurrentUser && (
          <Button
            onClick={() => navigate('/edit-profile')}
            className="border border-black px-6 py-2 bg-white hover:bg-gray-50 text-black"
            variant="outline"
          >
            Редактировать профиль
          </Button>
        )}
        
        {userType === 'Продавец' && (
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
