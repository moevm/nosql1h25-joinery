
import { FC } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface DescriptionInputProps {
  description: string;
  setDescription: (description: string) => void;
  isEdit: boolean;
}

const DescriptionInput: FC<DescriptionInputProps> = ({ 
  description, 
  setDescription, 
  isEdit 
}) => {
  return (
    <div className="h-64">
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={isEdit ? "" : "Описание объявления"}
        className="w-full h-full border-2 border-black p-4 resize-none text-lg"
        required
      />
    </div>
  );
};

export default DescriptionInput;
