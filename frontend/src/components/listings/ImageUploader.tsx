import { FC } from 'react';

interface ImageUploaderProps {
  setImage?: (image: string) => void;
}

const ImageUploader: FC<ImageUploaderProps> = ({ setImage }) => {
  return (
    <div className="mb-10">
      <button 
        type="button" 
        className="w-full border-2 border-black py-4 px-6 text-center bg-white hover:bg-gray-50"
      >
        Загрузить фото
      </button>
    </div>
  );
};

export default ImageUploader;
