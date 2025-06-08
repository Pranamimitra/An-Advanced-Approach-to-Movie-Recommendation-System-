import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="relative z-50 flex justify-center mt-14 px-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="relative w-full max-w-2xl">
        <Search
          className="absolute top-1/2 left-6 transform -translate-y-1/2 pointer-events-none select-none"
          aria-hidden="true"
          style={{
            color: 'var(--fadedGold)',
            filter: 'drop-shadow(0 0 6px rgba(201,180,88,0.7))',
            height: '1.75rem',
            width: '1.75rem',
          }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a movie or show..."
          aria-label="Search movies or shows"
          spellCheck={false}
          autoComplete="off"
          style={{
            width: '100%',
            paddingLeft: '4rem',
            paddingRight: '8rem',
            paddingTop: '1rem',
            paddingBottom: '1rem',
            borderRadius: '9999px',
            backgroundColor: 'var(--card-surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--sepia-accent)',
            boxShadow: '0 6px 20px rgba(139,106,79,0.25)',
            fontWeight: 500,
            fontSize: '1.125rem',
            letterSpacing: '0.05em',
            outline: 'none',
            transition: 'all 0.35s ease-in-out',
          }}
          className="placeholder-dustyTaupe focus:ring-4 focus:ring-fadedGold"
          // Tailwind placeholder color still works if this class exists, or define placeholder color in CSS
        />
        <button
          type="submit"
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'var(--primary-accent)',
            color: 'var(--text-primary)',
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
            padding: '0.75rem 2rem',
            borderRadius: '9999px',
            boxShadow: '0 6px 12px rgba(123,45,38,0.8)',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
            border: 'none',
          }}
          className="hover:bg-fadedGold hover:text-smoky focus:outline-none focus:ring-4 focus:ring-fadedGold"
        >
          Search
        </button>
      </div>
    </motion.form>
  );
}
