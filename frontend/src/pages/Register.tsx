
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/hooks/useApp';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ImageUploader from '@/components/listings/ImageUploader';

const formSchema = z.object({
  fullName: z.string().min(1, 'ФИО обязательно'),
  userType: z.string(),
  login: z.string().min(3, 'Логин должен содержать минимум 3 символа'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  age: z.coerce.number().int().min(14, 'Возраст должен быть не менее 14 лет').max(120, 'Введите корректный возраст'),
  education: z.string().optional(),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, user } = useApp();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [avatarImage, setAvatarImage] = useState('');
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      userType: 'Покупатель',
      login: '',
      password: '',
      age: 18,
      education: '',
      description: '',
    },
  });

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    
    try {
      await registerUser(
        data.fullName, 
        data.userType, 
        data.login, 
        data.password,
        data.age,
        data.education,
        data.description,
        avatarImage // Передаем URL аватара при регистрации
      );
      // Успешная регистрация перенаправит нас на главную
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка регистрации',
        description: 'Не удалось создать аккаунт. Проверьте данные и попробуйте снова.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-black text-white p-4">
        <Link to={user ? "/" : "/login"} className="text-4xl font-bold">
          Юпитер
        </Link>
      </header>
      
      <div className="flex-grow flex flex-col items-center justify-center py-8">
        <h1 className="text-4xl font-bold mb-8">Регистрация</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">ФИО</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full border border-black p-3" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Добавляем загрузчик аватара */}
            <div className="space-y-2">
              <span className="text-xl font-medium">Фото профиля</span>
              <ImageUploader 
                setImage={setAvatarImage}
                label="Фото профиля"
              />
            </div>
            
            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">Тип пользователя</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full border border-black p-3"
                    >
                      <option value="Покупатель">Покупатель</option>
                      <option value="Продавец">Продавец</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="login"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">Логин</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full border border-black p-3" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">Пароль</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} className="w-full border border-black p-3" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">Возраст</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={14}
                      max={120}
                      {...field} 
                      className="w-full border border-black p-3" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">Образование</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full border border-black p-3" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">О себе</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="w-full border border-black p-3 min-h-[100px]" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <button
              type="submit"
              className="w-full border border-black p-3 text-xl font-medium mt-4"
              disabled={loading}
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Register;
