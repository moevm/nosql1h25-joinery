
import { FC, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, Link, Image as ImageIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "@/components/ui/use-toast";

interface ImageUploaderProps {
  setImage?: (image: string) => void;
  currentImage?: string;
  label?: string;
}

const ImageUploader: FC<ImageUploaderProps> = ({
  setImage,
  currentImage,
  label = "Изображение"
}) => {
  const [imageUrl, setImageUrl] = useState(currentImage || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUrlLoading, setIsUrlLoading] = useState(false);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleUrlSubmit = () => {
    if (!imageUrl) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, укажите URL изображения",
        variant: "destructive"
      });
      return;
    }

    setIsUrlLoading(true);
    
    // Test if the URL is valid
    const img = document.createElement('img');
    img.onload = () => {
      setPreviewUrl(imageUrl);
      setImage && setImage(imageUrl);
      toast({
        title: "Успешно",
        description: "Изображение добавлено"
      });
      setIsUrlLoading(false);
    };
    img.onerror = () => {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить изображение. Проверьте URL",
        variant: "destructive"
      });
      setIsUrlLoading(false);
    };
    img.src = imageUrl;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = () => {
    if (!selectedFile) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите файл",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate file upload
    // In a real app, this would send the file to a server
    setTimeout(() => {
      if (previewUrl && setImage) {
        setImage(previewUrl);
        toast({
          title: "Успешно",
          description: "Изображение загружено"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium mb-2">{label}</div>
      
      {previewUrl && (
        <div className="mb-4 border border-black p-2">
          <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto" />
        </div>
      )}
      
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Загрузка файла</TabsTrigger>
          <TabsTrigger value="url">Ссылка на изображение</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-4">
          <Input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="cursor-pointer" 
          />
          <Button 
            onClick={handleFileUpload} 
            className="w-full border-2 border-black py-4 px-6 text-center bg-white hover:bg-gray-50 text-black" 
            variant="outline"
            disabled={isLoading}
          >
            <Upload className="mr-2 h-4 w-4" /> 
            {isLoading ? 'Загрузка...' : 'Загрузить изображение'}
          </Button>
        </TabsContent>
        
        <TabsContent value="url" className="space-y-4">
          <Input 
            type="url" 
            placeholder="https://example.com/image.jpg" 
            value={imageUrl} 
            onChange={handleUrlChange} 
          />
          <Button 
            onClick={handleUrlSubmit} 
            className="w-full border-2 border-black py-4 px-6 text-center bg-white hover:bg-gray-50 text-black" 
            variant="outline"
            disabled={isUrlLoading}
          >
            <Link className="mr-2 h-4 w-4" /> 
            {isUrlLoading ? 'Загрузка...' : 'Использовать ссылку'}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImageUploader;
