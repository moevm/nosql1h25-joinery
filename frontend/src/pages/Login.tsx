
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/hooks/useApp';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login, user, loading } = useApp();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(username, password);
      // Если успешно, нас перенаправит на главную страницу благодаря эффекту выше
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка входа',
        description: 'Неверный логин или пароль. Попробуйте еще раз.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-black text-white p-4">
        <Link to={user ? "/" : "/login"} className="text-4xl font-bold">
          Юпитер
        </Link>
      </header>
      
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8">Вход</h1>
        
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-6">
            <label htmlFor="username" className="block text-xl mb-2">Логин</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-black p-3"
              required
              disabled={isSubmitting || loading}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-xl mb-2">Пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-black p-3"
              required
              disabled={isSubmitting || loading}
            />
          </div>
          
          <button
            type="submit"
            className="w-full border border-black p-3 text-xl font-medium mt-4"
            disabled={isSubmitting || loading}
          >
            {(isSubmitting || loading) ? 'Вход...' : 'Войти'}
          </button>
        </form>
        
        <Link to="/register" className="mt-8 underline">
          Регистрация
        </Link>
      </div>
    </div>
  );
};

export default Login;
