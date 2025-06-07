import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ isLightTheme, setIsLightTheme }) {
  const toggleTheme = () => {
    const newTheme = isLightTheme ? 'dark' : 'light';
    setIsLightTheme(!isLightTheme);
    localStorage.setItem('theme', newTheme);

    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`
        px-5
        py-3
        rounded-full
        shadow-xl
        transition
        duration-500
        ease-in-out
        flex
        items-center
        justify-center
        cursor-pointer
        select-none
        ${!isLightTheme
          ? 'bg-filmGray hover:bg-sepiaAccent'
          : 'bg-pink-50 hover:bg-pink-200'}
      `}
      style={{
        fontFamily: "'Inter', sans-serif",
        boxShadow: !isLightTheme
          ? '0 6px 20px rgba(139,106,79,0.5)'
          : '0 8px 25px rgba(255,182,193,0.6)',
      }}
    >
      {!isLightTheme ? (
        <Sun
          className="
            w-7 h-7
            text-fadedGold
            drop-shadow-[0_0_10px_rgba(201,180,88,0.9)]
            transition
            duration-500
            ease-in-out
            transform
            hover:scale-110
          "
        />
      ) : (
        <Moon
          className="
            w-7 h-7
            text-vintageMaroon
            drop-shadow-[0_0_8px_rgba(123,45,38,0.8)]
            transition
            duration-500
            ease-in-out
            transform
            hover:scale-110
          "
        />
      )}
    </button>
  );
}
