
import React, { useState } from 'react';
import { useApp } from '@/hooks/useApp';
import Header from '@/components/Header';
import { Upload, Download, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [showStats, setShowStats] = useState(false);

  // Redirect if not admin
  React.useEffect(() => {
    if (user && user.userType !== 'Админ') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      console.log('Uploading file:', file.name);
      // Here you would implement actual file upload logic
      alert('Файл успешно загружен');
    } else {
      alert('Пожалуйста, выберите файл для загрузки');
    }
  };

  const handleDownload = () => {
    console.log('Downloading data');
    // Here you would implement actual file download logic
    alert('Данные выгружены');
  };

  const toggleStats = () => {
    setShowStats(!showStats);
  };

  if (!user || user.userType !== 'Админ') {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto p-4">
          <p>У вас нет доступа к этой странице</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto p-4 hidden">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Панель администратора</h1>
          <h2 className="text-2xl">для работы с БД</h2>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* File Upload Area */}
          <Card className="border-2 border-black p-6 mb-8">
            <CardContent className="flex flex-col items-center justify-center h-40 p-0">
              <label 
                htmlFor="file-upload" 
                className="cursor-pointer w-full h-full flex items-center justify-center"
              >
                <span className="text-gray-400 text-lg">Перенесите сюда файл</span>
                <input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </label>
              {file && (
                <div className="mt-2 text-sm">
                  Выбран файл: {file.name}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="flex justify-between mb-8">
            <Button 
              onClick={handleUpload} 
              className="border-2 border-black bg-white text-black hover:bg-gray-100 rounded-none px-8 py-4 text-lg flex items-center gap-2"
              variant="outline"
            >
              <Upload className="h-5 w-5" />
              Загрузить
            </Button>
            
            <Button 
              onClick={handleDownload} 
              className="border-2 border-black bg-white text-black hover:bg-gray-100 rounded-none px-8 py-4 text-lg flex items-center gap-2"
              variant="outline"
            >
              <Download className="h-5 w-5" />
              Выгрузить
            </Button>
          </div>

          {/* Statistics Button */}
          <div className="flex justify-center mb-8">
            <Button 
              onClick={toggleStats} 
              className="border-2 border-black bg-white text-black hover:bg-gray-100 rounded-full px-10 py-6 text-lg flex items-center gap-2"
              variant="outline"
            >
              <BarChart className="h-5 w-5" />
              Статистика
            </Button>
          </div>

          {/* Statistics Section */}
          {showStats && (
            <Card className="border-2 border-black p-6 mb-8">
              <h3 className="text-2xl font-bold mb-4 text-center">Статистика пользователей</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Тип пользователя</TableHead>
                    <TableHead>Количество</TableHead>
                    <TableHead>Активность</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Продавец</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>Высокая</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Покупатель</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>Средняя</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Админ</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>Высокая</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <h3 className="text-2xl font-bold my-4 text-center">Статистика объявлений</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Статус</TableHead>
                    <TableHead>Количество</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Активные</TableCell>
                    <TableCell>12</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Завершенные</TableCell>
                    <TableCell>5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>На модерации</TableCell>
                    <TableCell>3</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
