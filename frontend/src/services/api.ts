import { User, ListingItem, Comment, Review } from "@/types";

const API_URL = 'http://localhost:5000/api';

// Преобразование данных пользователя из API в формат приложения
const mapUserFromApi = (userData: any): User => {
  let userType = 'Покупатель';
  if (userData.role === 'master') userType = 'Продавец';
  else if (userData.role === 'admin') userType = 'Админ';
  
  return {
    id: userData.login,
    fullName: userData.full_name,
    userType,
    login: userData.login,
    isLoggedIn: true,
    bio: userData.description || '',
    age: userData.age,
    education: userData.education || '',
    rating: 0,
    registrationDate: userData.created_at?.split('T')[0] || '',
    lastUpdate: userData.updated_at?.split('T')[0] || '',
    image: userData.photo_url || '',
    status: userData.status || 'active',
  };
};

// Преобразование данных объявления из API в формат приложения
const mapListingFromApi = (listing: any, userMap?: Map<string, User>): ListingItem => {
  const masterName = userMap?.get(listing.master)?.fullName || listing.master;
  
  return {
    id: `${listing.master}_${listing.number}`,
    title: listing.name,
    masterId: listing.master,
    masterName: masterName,
    width: listing.width,
    height: listing.height,
    length: listing.length,
    weight: listing.weight,
    quantity: listing.amount,
    price: listing.price,
    address: listing.address,
    description: listing.description || '',
    imageUrl: listing.photo_url || '/lovable-uploads/acaffa7b-bc52-4650-991b-6b34f30621b2.png',
    createdAt: listing.created_at || new Date().toISOString(),
    updatedAt: listing.updated_at || new Date().toISOString(),
    number: listing.number,
  };
};

// API запросы
export const apiService = {
  // Авторизация
  login: async (login: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      });
      
      if (!response.ok) {
        throw new Error('Ошибка авторизации');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Ошибка входа:', error);
      throw error;
    }
  },
  
  // Регистрация
  register: async (
    fullName: string, 
    userType: string, 
    login: string, 
    password: string, 
    age?: number,
    education?: string,
    description?: string,
    image?: string
  ) => {
    try {
      let role = 'buyer';
      if (userType === 'Продавец') role = 'master';
      else if (userType === 'Админ') role = 'admin';
      
      const requestBody: Record<string, any> = {
        login,
        password,
        role,
        full_name: fullName,
        age: age || 18
      };
      
      console.log("Отправка данных для регистрации:", requestBody);
      
      const response = await fetch(`${API_URL}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Ответ сервера при ошибке регистрации:", errorText);
        throw new Error('Ошибка регистрации');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      throw error;
    }
  },
  
  // Получение пользователя по ID (login)
  getUser: async (login: string): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/users/${login}/`);
      
      if (!response.ok) {
        throw new Error('Пользователь не найден');
      }
      
      const userData = await response.json();
      return mapUserFromApi(userData);
    } catch (error) {
      console.error('Ошибка получения пользователя:', error);
      throw error;
    }
  },

  // Обновление профиля пользователя
  updateUserProfile: async (login: string, updates: {
    fullName?: string;
    age?: number;
    bio?: string;
    education?: string;
    image?: string;
  }) => {
    try {
      const requestBody: Record<string, any> = {};
      
      if (updates.fullName) requestBody.full_name = updates.fullName;
      if (updates.age) requestBody.age = updates.age;
      if (updates.bio) requestBody.description = updates.bio;
      if (updates.education) requestBody.education = updates.education;
      if (updates.image) requestBody.photo_url = updates.image;
      
      const response = await fetch(`${API_URL}/users/${login}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        throw new Error('Ошибка обновления профиля');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      throw error;
    }
  },

  // Изменение статуса пользователя (только для админа)
  updateUserStatus: async (login: string, status: string) => {
    try {
      const response = await fetch(`${API_URL}/users/${login}/status/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Ошибка изменения статуса пользователя');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Ошибка изменения статуса пользователя:', error);
      throw error;
    }
  },
  
  // Получение всех объявлений с фильтрацией
  getListings: async (filters?: any): Promise<ListingItem[]> => {
    try {
      let url = `${API_URL}/announcements/`;
      
      if (filters) {
        const params = new URLSearchParams();
        
        if (filters.title) params.append('name', filters.title);
        if (filters.master) params.append('master', filters.master);
        
        if (filters.width?.min) params.append('width_min', filters.width.min);
        if (filters.width?.max) params.append('width_max', filters.width.max);
        
        if (filters.height?.min) params.append('height_min', filters.height.min);
        if (filters.height?.max) params.append('height_max', filters.height.max);
        
        if (filters.length?.min) params.append('length_min', filters.length.min);
        if (filters.length?.max) params.append('length_max', filters.length.max);
        
        if (filters.weight?.min) params.append('weight_min', filters.weight.min);
        if (filters.weight?.max) params.append('weight_max', filters.weight.max);
        
        if (filters.quantity?.min) params.append('amount_min', filters.quantity.min);
        if (filters.quantity?.max) params.append('amount_max', filters.quantity.max);
        
        if (filters.price?.min) params.append('price_min', filters.price.min);
        if (filters.price?.max) params.append('price_max', filters.price.max);
        
        if (filters.address) params.append('address', filters.address);
        
        url = `${url}?${params.toString()}`;
      }
      
      console.info('Запрос на получение объявлений:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Ошибка получения объявлений: ${response.status} ${response.statusText}`);
      }
      
      const listings = await response.json();
      
      const uniqueMasters = new Set(listings.map((listing: any) => listing.master));
      const userMap = new Map<string, User>();
      
      await Promise.all(Array.from(uniqueMasters).map(async (masterLogin) => {
        try {
          const user = await apiService.getUser(masterLogin as string);
          userMap.set(masterLogin as string, user);
        } catch (error) {
          console.error(`Ошибка получения данных мастера ${masterLogin}:`, error);
        }
      }));
      
      return listings.map((listing: any) => mapListingFromApi(listing, userMap));
    } catch (error) {
      console.error('Ошибка получения объявлений:', error);
      return [];
    }
  },
  
  // Создание объявления
  createListing: async (login: string, listing: Omit<ListingItem, 'id' | 'masterId' | 'masterName' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch(`${API_URL}/announcements/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login,
          name: listing.title,
          width: listing.width,
          height: listing.height,
          length: listing.length,
          weight: listing.weight,
          amount: listing.quantity,
          price: listing.price,
          address: listing.address,
          description: listing.description,
          photo_url: listing.imageUrl
        }),
      });
      
      if (!response.ok) {
        throw new Error('Ошибка создания объявления');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Ошибка создания объявления:', error);
      throw error;
    }
  },

  // Обновление объявления
  updateListing: async (masterId: string, number: number, updates: Partial<ListingItem>) => {
    try {
      const requestBody: Record<string, any> = {};
      
      if (updates.title) requestBody.name = updates.title;
      if (updates.width !== undefined) requestBody.width = updates.width;
      if (updates.height !== undefined) requestBody.height = updates.height;
      if (updates.length !== undefined) requestBody.length = updates.length;
      if (updates.weight !== undefined) requestBody.weight = updates.weight;
      if (updates.quantity !== undefined) requestBody.amount = updates.quantity;
      if (updates.price !== undefined) requestBody.price = updates.price;
      if (updates.address) requestBody.address = updates.address;
      if (updates.description) requestBody.description = updates.description;
      if (updates.imageUrl) requestBody.photo_url = updates.imageUrl;
      
      const response = await fetch(`${API_URL}/announcements/${masterId}/${number}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        throw new Error('Ошибка обновления объявления');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Ошибка обновления объявления:', error);
      throw error;
    }
  },

  // Удаление объявления
  deleteListing: async (masterId: string, number: number) => {
    try {
      const response = await fetch(`${API_URL}/announcements/${masterId}/${number}/`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Ошибка удаления объявления');
      }
      
      return true;
    } catch (error) {
      console.error('Ошибка удаления объявления:', error);
      throw error;
    }
  },
  
  // Получение объявления по ID
  getListing: async (masterId: string, number: number): Promise<ListingItem> => {
    try {
      const response = await fetch(`${API_URL}/announcements/${masterId}/${number}/`);
      
      if (!response.ok) {
        throw new Error('Объявление не найдено');
      }
      
      const listingData = await response.json();
      return mapListingFromApi(listingData);
    } catch (error) {
      console.error('Ошибка получения объявления:', error);
      throw error;
    }
  },
  
  // Получение комментариев к объявлению
  getListingComments: async (masterId: string, number: number): Promise<Comment[]> => {
    try {
      const response = await fetch(`${API_URL}/announcements/${masterId}/${number}/comments/`);
      
      if (!response.ok) {
        throw new Error('Ошибка получения комментариев');
      }
      
      const comments = await response.json();
      
      const uniqueAuthors = new Set(comments.map((comment: any) => comment.author));
      const userMap = new Map<string, User>();
      
      await Promise.all(Array.from(uniqueAuthors).map(async (authorLogin) => {
        try {
          const user = await apiService.getUser(authorLogin as string);
          userMap.set(authorLogin as string, user);
        } catch (error) {
          console.error(`Ошибка получения данных автора ${authorLogin}:`, error);
        }
      }));
      
      return comments.map((comment: any) => ({
        id: `${comment.author}_${Date.now()}`,
        listingId: `${masterId}_${number}`,
        userId: comment.author,
        userName: userMap.get(comment.author)?.fullName || comment.author,
        text: comment.text,
        createdAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Ошибка получения комментариев:', error);
      return [];
    }
  },
  
  // Добавление комментария к объявлению
  addListingComment: async (sender_login: string, masterId: string, number: number, text: string) => {
    try {
      const response = await fetch(`${API_URL}/announcements/${masterId}/${number}/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_login,
          text
        }),
      });
      
      if (!response.ok) {
        throw new Error('Ошибка добавления комментария');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Ошибка добавления комментария:', error);
      throw error;
    }
  },

  // Удаление комментария к объявлению
  deleteListingComment: async (masterId: string, number: number, authorLogin: string) => {
    try {
      const response = await fetch(`${API_URL}/announcements/${masterId}/${number}/comments/${authorLogin}/`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Ошибка удаления комментария');
      }
      
      return true;
    } catch (error) {
      console.error('Ошибка удаления комментария:', error);
      throw error;
    }
  },
  
  // Получение отзывов о пользователе
  getUserReviews: async (login: string): Promise<Review[]> => {
    try {
      const response = await fetch(`${API_URL}/users/${login}/comments/`);
      
      if (!response.ok) {
        throw new Error('Ошибка получения отзывов');
      }
      
      const reviews = await response.json();
      
      const uniqueAuthors = new Set(reviews.map((review: any) => review.author));
      const userMap = new Map<string, User>();
      
      await Promise.all(Array.from(uniqueAuthors).map(async (authorLogin) => {
        try {
          const user = await apiService.getUser(authorLogin as string);
          userMap.set(authorLogin as string, user);
        } catch (error) {
          console.error(`Ошибка получения данных автора ${authorLogin}:`, error);
        }
      }));
      
      return reviews.map((review: any) => ({
        id: `${review.author}_${Date.now()}`,
        userId: login,
        authorId: review.author,
        authorName: userMap.get(review.author)?.fullName || review.author,
        text: review.text,
        rating: review.estimation,
        createdAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Ошибка получения отзывов:', error);
      return [];
    }
  },
  
  // Добавление отзыва о пользователе
  addUserReview: async (sender_login: string, recipient_login: string, text: string, estimation: number) => {
    try {
      console.log(`Sending review to: ${API_URL}/users/${recipient_login}/comments/`);
      console.log('Review payload:', {
        sender_login,
        text,
        estimation
      });
      
      const response = await fetch(`${API_URL}/users/${recipient_login}/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_login,
          text,
          estimation
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server error response:', errorData);
        throw new Error(`Ошибка добавления отзыва: ${response.status} ${response.statusText}`);
      }
      
      const responseData = await response.json();
      console.log('Review API response:', responseData);
      return responseData;
    } catch (error) {
      console.error('Ошибка добавления отзыва:', error);
      throw error;
    }
  },

  // Удаление отзыва о пользователе
  deleteUserReview: async (userLogin: string, authorLogin: string) => {
    try {
      const response = await fetch(`${API_URL}/users/${userLogin}/comments/${authorLogin}/`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Ошибка удаления отзыва');
      }
      
      return true;
    } catch (error) {
      console.error('Ошибка удаления отзыва:', error);
      throw error;
    }
  },

  // Получение бэкапа базы данных
  getBackup: async () => {
    try {
      const response = await fetch(`${API_URL}/backup/`);
      
      if (!response.ok) {
        throw new Error('Ошибка получения бэкапа');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Ошибка получения бэкапа:', error);
      throw error;
    }
  },

  // Загрузка бэкапа в базу данных
  uploadBackup: async (backupData: any) => {
    try {
      const response = await fetch(`${API_URL}/backup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          backup_data: backupData
        }),
      });
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки бэкапа');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Ошибка загрузки бэкапа:', error);
      throw error;
    }
  }
};
