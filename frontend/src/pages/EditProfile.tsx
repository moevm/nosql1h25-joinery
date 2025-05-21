
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useApp } from '@/hooks/useApp';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ProfileImageUploader from '@/components/profile/ProfileImageUploader';
import { toast } from '@/components/ui/use-toast';

const EditProfile = () => {
  const { user, updateUserProfile } = useApp();
  const navigate = useNavigate();
  
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [age, setAge] = useState('');
  const [education, setEducation] = useState('');
  const [image, setImage] = useState('');
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setFullName(user.fullName || '');
    setBio(user.bio || '');
    setAge(user.age ? String(user.age) : '');
    setEducation(user.education || '');
    setImage(user.image || '');
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      await updateUserProfile({
        fullName,
        bio,
        age: age ? parseInt(age, 10) : undefined,
        education,
        image
      });
      
      toast({
        title: 'Успешно',
        description: 'Профиль обновлен'
      });
      
      navigate(`/profile/${user.id}`);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить профиль',
        variant: 'destructive'
      });
    }
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto p-4">
        <h1 className="text-4xl mb-6">Редактирование профиля</h1>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
          <ProfileImageUploader
            currentImage={image}
            setImage={setImage}
          />
          
          <div className="space-y-2">
            <label htmlFor="fullName" className="font-medium">Полное имя</label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="bio" className="font-medium">О себе</label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="age" className="font-medium">Возраст</label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="education" className="font-medium">Образование</label>
            <Input
              id="education"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <Button 
              type="submit" 
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              Сохранить
            </Button>
            <Button 
              type="button"
              variant="outline"
              className="w-full border-black"
              onClick={() => navigate(`/profile/${user.id}`)}
            >
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
