
import React from 'react';
import ImageUploader from '../listings/ImageUploader';

interface ProfileImageUploaderProps {
  currentImage?: string;
  setImage: (image: string) => void;
}

const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({ currentImage, setImage }) => {
  return (
    <div className="mb-6">
      <ImageUploader 
        currentImage={currentImage} 
        setImage={setImage}
        label="Фото профиля"
      />
    </div>
  );
};

export default ProfileImageUploader;
