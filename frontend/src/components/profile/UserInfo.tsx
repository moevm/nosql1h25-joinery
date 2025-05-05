import React from 'react';
import { User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { useApp } from '@/hooks/useApp';

interface UserInfoProps {
  profileUser: User;
  formatDate: (dateString: string) => string;
}

const UserInfo = ({ profileUser, formatDate }: UserInfoProps) => {
  const { user: currentUser } = useApp();
  
  // Check if the current user is logged in and is an admin
  const isCurrentUserAdmin = currentUser && currentUser.userType === 'Админ';
  
  return (
    <div className="col-span-1">
      <div className="border border-black p-4 mb-6">
        <div className="flex flex-col items-center mb-4">
          {profileUser.image ? (
            <img 
              src={profileUser.image} 
              alt={profileUser.fullName}
              className="w-64 h-64 object-cover mb-4" 
            />
          ) : (
            <Avatar className="h-64 w-64 rounded-none border border-black">
              <AvatarFallback>{profileUser.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          <h2 className="text-2xl font-bold text-center">{profileUser.fullName}</h2>
        </div>
        
        <div className="text-sm">
          <p className="mb-1">Зарегистрирован: {formatDate(profileUser.registrationDate || '')}</p>
          <p>Последние изменения: {formatDate(profileUser.lastUpdate || '')}</p>
        </div>
        
        <hr className="my-4 border-t border-black" />
        
        <div>
          <p className="font-bold mb-2">Рейтинг профиля</p>
          <p className="text-4xl">{profileUser.rating?.toFixed(1)}</p>
        </div>
      </div>
      
      <div className="border border-black p-4">
        <p className="font-bold mb-2">О себе:</p>
        <p className="italic mb-4">{profileUser.bio || 'Информация отсутствует'}</p>
        
        {profileUser.age && (
          <p className="mb-1">Возраст: {profileUser.age}</p>
        )}
        
        {profileUser.education && (
          <p className="mb-1">Образование: {profileUser.education}</p>
        )}
      </div>
      
      {profileUser.userType === 'Продавец' && (
        <div className="mt-6">
          <Link 
            to="/" 
            className="block text-center border border-black py-2 px-4 hover:bg-gray-100 transition-colors"
          >
            Все объявления
          </Link>
        </div>
      )}
      
      {/* Only show admin panel button if current user is an admin */}
      {isCurrentUserAdmin && (
        <div className="mt-6">
          <Link 
            to="/admin"
            className="block text-center border border-black py-2 px-4 bg-black text-white hover:bg-gray-900 transition-colors"
          >
            Панель админа
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
