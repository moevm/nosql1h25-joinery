import { FC } from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  isEdit: boolean;
  handleDelete?: () => void;
}

const FormActions: FC<FormActionsProps> = ({ isEdit, handleDelete }) => {
  return (
    <div className="flex justify-center space-x-6">
      {isEdit ? (
        <>
          <Button
            type="submit"
            className="rounded-full border-2 border-black px-10 py-2 bg-white text-black hover:bg-gray-100"
          >
            Сохранить
          </Button>
          
          <Button
            type="button"
            onClick={handleDelete}
            className="rounded-full border-2 border-black px-10 py-2 bg-white text-black hover:bg-gray-100"
          >
            Удалить
          </Button>
        </>
      ) : (
        <Button
          type="submit"
          className="rounded-full border-2 border-black px-10 py-2 bg-white text-black hover:bg-gray-100"
        >
          Отправить
        </Button>
      )}
    </div>
  );
};

export default FormActions;
