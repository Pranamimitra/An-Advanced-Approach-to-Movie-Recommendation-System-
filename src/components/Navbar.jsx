import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ isLightTheme, setIsLightTheme }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <nav
      className="px-8 py-4 flex justify-between items-center backdrop-blur-md transition-all duration-700 ease-in-out"
      style={{
        fontFamily: '"Inter", sans-serif',
        boxShadow: '0 4px 12px rgba(123, 45, 38, 0.5)',
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-primary)',
      }}
    >
      <Link
        to="/"
        className="text-3xl font-title transition-all duration-300 hover:scale-105 cursor-pointer"
        style={{
          fontFamily: '"Playfair Display", serif',
          color: 'var(--primary-accent)',
          textShadow: '0 2px 8px rgba(123, 45, 38, 0.5)',
        }}
        aria-label="The Screening Room Home"
      >
        The Screening Room
      </Link>

      <div className="flex items-center space-x-6 sm:space-x-8 text-base select-none">
        {['/', '/explore', '/about'].map((path, idx) => {
          const label =
            path === '/'
              ? 'Home'
              : path.charAt(1).toUpperCase() + path.slice(2); // corrected slice here
          return (
            <Link
              key={idx}
              to={path}
              className="transition-colors duration-300 ease-in-out font-medium"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--fadedGold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              aria-label={label}
            >
              {label}
            </Link>
          );
        })}

        {user ? (
          <>
            <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              Welcome,{' '}
              <span style={{ fontWeight: '600', color: 'var(--fadedGold)' }}>{user.username}</span>
            </span>

            <button
              onClick={handleLogout}
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '0.375rem',
                fontWeight: '600',
                color: 'var(--primary-accent)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.3s ease-in-out',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--fadedGold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--primary-accent)')}
            >
              Logout
            </button>

            <Link
              to="/watchlist"
              className="font-medium transition-colors duration-300"
              style={{ color: 'var(--sepia-accent)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--fadedGold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--sepia-accent)')}
              aria-label="Watchlist"
            >
              Watchlist
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/signup"
              className="transition-colors duration-300"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--fadedGold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              aria-label="Sign Up"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="transition-colors duration-300"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--fadedGold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              aria-label="Login"
            >
              Login
            </Link>
          </>
        )}

        {/* Theme toggle */}
        <ThemeToggle isLightTheme={isLightTheme} setIsLightTheme={setIsLightTheme} />
      </div>
    </nav>
  );
}
