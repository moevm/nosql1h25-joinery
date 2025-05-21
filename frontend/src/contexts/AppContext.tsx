
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { AppContextType } from './AppContextType';
import { User, ListingItem, Comment, Review } from '@/types';
import { sampleListings, sampleComments, sampleUsers, sampleReviews } from '@/data/sampleData';
import { apiService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

// Create context
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Context Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Загрузка начальных данных
  useEffect(() => {
    fetchListings();
  }, []);

  // Функция для загрузки объявлений
  const fetchListings = async (filters?: any) => {
    setLoading(true);
    try {
      const fetchedListings = await apiService.getListings(filters);
      setListings(fetchedListings);
    } catch (error) {
      console.error('Ошибка при загрузке объявлений:', error);
      setListings(sampleListings); // Используем примерные данные как запасной вариант
    } finally {
      setLoading(false);
    }
  };

  const login = async (login: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiService.login(login, password);
      if (response) {
        // Получаем полные данные о пользователе
        const userData = await apiService.getUser(response.login);
        setUser(userData);
        
        toast({
          title: 'Успех',
          description: 'Вы успешно авторизовались',
        });
      }
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Неверный логин или пароль',
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    toast({
      title: 'Выход из системы',
      description: 'Вы успешно вышли из аккаунта',
    });
  };

  const register = async (
    fullName: string, 
    userType: string, 
    login: string, 
    password: string,
    age?: number,
    education?: string,
    description?: string,
    image?: string
  ) => {
    setLoading(true);
    try {
      await apiService.register(fullName, userType, login, password, age, education, description, image);
      
      // После успешной регистрации автоматически входим
      await apiService.login(login, password);
      
      // Получаем полные данные о пользователе
      const userData = await apiService.getUser(login);
      setUser(userData);
      
      toast({
        title: 'Успех',
        description: 'Вы успешно зарегистрировались',
      });
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось зарегистрироваться. Возможно, такой логин уже занят.',
      });
    } finally {
      setLoading(false);
    }
  };

  const createListing = async (listing: Omit<ListingItem, 'id' | 'masterId' | 'masterName' | 'createdAt' | 'updatedAt'>) => {
    if (user) {
      setLoading(true);
      try {
        await apiService.createListing(user.login, listing);
        toast({
          title: 'Успех',
          description: 'Объявление успешно создано',
        });
        fetchListings(); // Обновляем список объявлений
      } catch (error) {
        console.error('Ошибка создания объявления:', error);
        toast({
          variant: 'destructive',
          title: 'Ошибка',
          description: 'Не удалось создать объявление',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const updateListing = (id: string, updates: Partial<ListingItem>) => {
    // Для обновления объявлений потребуется доработка API
    // Пока используем локальное обновление
    setListings(
      listings.map((listing) =>
        listing.id === id
          ? { ...listing, ...updates, updatedAt: new Date().toISOString() }
          : listing
      )
    );
  };

  const deleteListing = (id: string) => {
    // Для удаления объявлений потребуется доработка API
    // Пока используем локальное удаление
    setListings(listings.filter((listing) => listing.id !== id));
  };

  const addComment = async (listingId: string, text: string) => {
    if (user) {
      setLoading(true);
      try {
        // ID объявления имеет формат masterId_number
        const [masterId, numberStr] = listingId.split('_');
        const number = parseInt(numberStr);
        
        await apiService.addListingComment(user.login, masterId, number, text);
        
        // Добавляем комментарий локально для немедленного отображения
        const newComment: Comment = {
          id: Date.now().toString(),
          listingId,
          userId: user.id,
          userName: user.fullName,
          text,
          createdAt: new Date().toISOString(),
        };
        setComments([...comments, newComment]);
        
        toast({
          title: 'Успех',
          description: 'Комментарий добавлен',
        });
      } catch (error) {
        console.error('Ошибка добавления комментария:', error);
        toast({
          variant: 'destructive',
          title: 'Ошибка',
          description: 'Не удалось добавить комментарий',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const addReview = async (userId: string, text: string, rating: number) => {
    if (user) {
      setLoading(true);
      try {
        console.log(`Sending review from ${user.login} to user ${userId} with rating ${rating}`);
        
        // Важно! Используем userId как login получателя
        await apiService.addUserReview(user.login, userId, text, rating);
        
        // Добавляем отзыв локально для немедленного отображения
        const newReview: Review = {
          id: Date.now().toString(),
          userId,
          authorId: user.id,
          authorName: user.fullName,
          text,
          rating,
          createdAt: new Date().toISOString(),
        };
        setReviews([...reviews, newReview]);
        
        toast({
          title: 'Успех',
          description: 'Отзыв добавлен',
        });
      } catch (error) {
        console.error('Ошибка ��обавления отзыва:', error);
        toast({
          variant: 'destructive',
          title: 'Ошибка',
          description: 'Не удалось добавить отзыв',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const getUserById = async (id: string): Promise<User | undefined> => {
    try {
      const user = await apiService.getUser(id);
      return user;
    } catch (error) {
      console.error(`Ошибка получения пользователя с ID ${id}:`, error);
      return users.find(u => u.id === id); // Резервный вариант, ищем в локальных данных
    }
  };

  const getUserReviews = async (userId: string): Promise<Review[]> => {
    try {
      const fetchedReviews = await apiService.getUserReviews(userId);
      // Объединяем загруженные отзывы с локальными (которые могли быть добавлены недавно)
      const localReviews = reviews.filter(review => review.userId === userId);
      
      // Проверяем дубликаты (может потребоваться более сложная логика)
      const combinedReviews = [...fetchedReviews];
      
      // Находим локальные отзывы, которых нет в полученных от API
      localReviews.forEach(localReview => {
        const exists = fetchedReviews.some(
          fetchedReview => fetchedReview.authorId === localReview.authorId && 
                        fetchedReview.text === localReview.text
        );
        
        if (!exists) {
          combinedReviews.push(localReview);
        }
      });
      
      return combinedReviews;
    } catch (error) {
      console.error(`Ошибка получения отзывов пользователя ${userId}:`, error);
      return reviews.filter(review => review.userId === userId); // Резервный вариант
    }
  };

  const getUserListings = (userId: string): ListingItem[] => {
    return listings.filter(listing => listing.masterId === userId);
  };

  // New function to update user profile
  const updateUserProfile = async (updates: {
    fullName?: string;
    bio?: string;
    age?: number;
    education?: string;
    image?: string;
  }) => {
    if (!user) {
      throw new Error('User not logged in');
    }

    setLoading(true);
    try {
      // In a real app, we would send this to the API
      // For now, we'll just update the local state
      const updatedUser = {
        ...user,
        fullName: updates.fullName || user.fullName,
        bio: updates.bio || user.bio,
        age: updates.age || user.age,
        education: updates.education || user.education,
        image: updates.image || user.image,
        lastUpdate: new Date().toISOString().split('T')[0]
      };
      
      setUser(updatedUser);
      
      // Update users array as well
      setUsers(prevUsers => 
        prevUsers.map(u => u.id === user.id ? updatedUser : u)
      );
      
      toast({
        title: 'Успешно',
        description: 'Профиль обновлен',
      });
      
      return;
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось обновить профиль',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create context value
  const value: AppContextType = {
    user,
    listings,
    comments,
    users,
    reviews,
    loading,
    login,
    logout,
    register,
    createListing,
    updateListing,
    deleteListing,
    addComment,
    addReview,
    getUserById,
    getUserReviews,
    getUserListings,
    fetchListings,
    updateUserProfile,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
