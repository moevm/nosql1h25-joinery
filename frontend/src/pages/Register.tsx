import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/hooks/useApp';

const Register = () => {
  const navigate = useNavigate();
  const { register, user } = useApp();
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(fullName, userType, login, password);
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
        
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-6">
            <label htmlFor="fullName" className="block text-xl mb-2">ФИО</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-black p-3"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="userType" className="block text-xl mb-2">Тип пользователя</label>
            <input
              id="userType"
              type="text"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full border border-black p-3"
              required
              placeholder="Например: Мастер, Покупатель"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="login" className="block text-xl mb-2">Логин</label>
            <input
              id="login"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
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
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
