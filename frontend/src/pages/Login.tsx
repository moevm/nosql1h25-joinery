import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/hooks/useApp';

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
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
            />
          </div>
          
          <button
            type="submit"
            className="w-full border border-black p-3 text-xl font-medium mt-4"
          >
            Войти
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
