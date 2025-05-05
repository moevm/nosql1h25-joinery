import { FC } from 'react';

interface FormHeaderProps {
  isEdit: boolean;
}

const FormHeader: FC<FormHeaderProps> = ({ isEdit }) => {
  return (
    <h1 className="text-4xl text-center font-bold mb-10">
      {isEdit ? 'Редактирование объявления' : 'Создание объявления'}
    </h1>
  );
};

export default FormHeader;
