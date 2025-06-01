
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useApp } from '@/hooks/useApp';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download } from 'lucide-react';
import { apiService } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

const BackupManagement = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Redirect if not admin
  React.useEffect(() => {
    if (user && user.userType !== 'Админ') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Проверяем, что файл JSON
      if (selectedFile.type !== 'application/json' && !selectedFile.name.endsWith('.json')) {
        toast({
          title: "Ошибка",
          description: "Пожалуйста, выберите файл JSON",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите файл для загрузки",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const fileContent = await file.text();
      const backupData = JSON.parse(fileContent);
      
      await apiService.uploadBackup(backupData);
      
      toast({
        title: "Успех",
        description: "Бэкап успешно загружен в базу данных"
      });
      
      setFile(null);
      // Сброс значения input файла
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Ошибка загрузки бэкапа:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить бэкап. Проверьте формат файла.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      const backupData = await apiService.getBackup();
      
      // Создаем и скачиваем файл
      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "Успех",
        description: "Бэкап успешно скачан"
      });
      
    } catch (error) {
      console.error('Ошибка скачивания бэкапа:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось скачать бэкап",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
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
      
      <div className="container mx-auto p-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Управление бэкапами</h1>
          <h2 className="text-2xl text-gray-600">Загрузка и скачивание данных БД</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          {/* Загрузка бэкапа */}
          <Card className="border-2 border-black">
            <CardHeader>
              <CardTitle className="text-2xl">Загрузка бэкапа</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 p-8 text-center">
                <label 
                  htmlFor="file-upload" 
                  className="cursor-pointer block"
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <span className="text-lg text-gray-600">
                    Выберите JSON файл с бэкапом
                  </span>
                  <input 
                    id="file-upload" 
                    type="file" 
                    accept=".json,application/json"
                    className="hidden" 
                    onChange={handleFileChange} 
                  />
                </label>
                {file && (
                  <div className="mt-4 text-sm text-green-600">
                    Выбран файл: {file.name}
                  </div>
                )}
              </div>
              
              <Button 
                onClick={handleUpload} 
                disabled={!file || isUploading}
                className="w-full bg-black text-white hover:bg-gray-800"
              >
                {isUploading ? 'Загрузка...' : 'Загрузить бэкап в БД'}
              </Button>
            </CardContent>
          </Card>

          {/* Скачивание бэкапа */}
          <Card className="border-2 border-black">
            <CardHeader>
              <CardTitle className="text-2xl">Скачивание бэкапа</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Скачайте текущее состояние базы данных в формате JSON
              </p>
              
              <Button 
                onClick={handleDownload} 
                disabled={isDownloading}
                className="w-full bg-black text-white hover:bg-gray-800"
              >
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? 'Скачивание...' : 'Скачать бэкап БД'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BackupManagement;
