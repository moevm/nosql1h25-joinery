import { FC } from 'react';
import { Input } from '@/components/ui/input';

interface TitleInputProps {
  title: string;
  setTitle: (title: string) => void;
  isEdit: boolean;
}

const TitleInput: FC<TitleInputProps> = ({ title, setTitle, isEdit }) => {
  return (
    <div className="mb-10">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={isEdit ? title : "Введите заголовок"}
        className="w-full border-2 border-black p-4 text-xl font-medium placeholder:text-gray-400"
        required
      />
    </div>
  );
};

export default TitleInput;
