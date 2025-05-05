import { Link } from 'react-router-dom';
import { useApp } from '@/hooks/useApp';

const Header = () => {
  const { user, logout } = useApp();

  return (
    <header className="bg-black text-white w-full p-4">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-4xl font-bold">Юпитер</Link>
        {user ? (
          <div className="flex items-center gap-4">
            <Link to={`/profile/${user.id}`} className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
              <span className="text-black">{user.fullName.charAt(0)}</span>
            </Link>
            <button onClick={logout} className="underline">Выход</button>
          </div>
        ) : (
          <Link to="/login" className="border border-white px-4 py-2">
            Войти
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
