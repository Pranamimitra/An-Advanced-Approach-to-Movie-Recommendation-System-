import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Explore({ theme = 'dark' }) {
  // theme can be 'dark' or 'light' - pass as prop or from context

  const [data, setData] = useState({
    popular: [],
    top_rated: [],
    genres: {},
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/explore')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => {
        console.error("Explore fetch error:", err);
        setError("Failed to load data.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Your custom color palette variables (for inline styles)
  const colors = {
    dark: {
      background: '#1A1A1A',      // Smoky Charcoal
      primaryText: '#F5F3E7',     // Soft Ivory
      secondaryText: '#A89F91',   // Dusty Taupe
      cardSurface: '#2D2D2D',     // Film Gray
      primaryAccent: '#7B2D26',   // Vintage Maroon
      secondaryAccent: '#C9B458', // Faded Gold
      accentHighlight: '#8B6A4F', // Sepia Accent
      shadowColor: 'rgba(0, 0, 0, 0.5)', // dark shadow base
      noPosterBg: '#444',
      noPosterText: '#bbb',
    },
    light: {
      background: 'linear-gradient(135deg, #fce4ec, #f8bbd0, #f48fb1)', // Dreamy pink gradient
      primaryText: '#6e4b50',     // Muted Mauve
      secondaryText: '#a37c86',   // Slightly muted mauve
      cardSurface: '#fdf2f8',     // Light pinkish white
      primaryAccent: '#c06c84',   // Soft rose maroon
      secondaryAccent: '#f9c5d1', // Pale pink gold
      accentHighlight: '#f48fb1', // Bright pink glow
      shadowColor: 'rgba(192, 108, 132, 0.5)', // lighter shadow base
      noPosterBg: '#f9d7e0',
      noPosterText: '#7b4d57',
    }
  };

  // Choose palette based on theme
  const palette = theme === 'light' ? colors.light : colors.dark;

  const renderMovies = (movies) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
      {movies.map((movie, index) => (
        <Link
          key={index}
          to={`/search?query=${encodeURIComponent(movie.title)}`}
          className="rounded-xl p-4 cursor-pointer transform transition-all duration-300 ease-in-out"
          style={{
            backgroundColor: palette.cardSurface,
            boxShadow: `0 6px 12px ${palette.shadowColor}`,
            color: palette.primaryText,
            fontFamily: "'Inter', sans-serif",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = `0 8px 18px ${palette.accentHighlight}AA`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = `0 6px 12px ${palette.shadowColor}`;
          }}
        >
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`${movie.title} poster`}
              className="w-full h-72 object-cover rounded-md mb-3 shadow-lg"
              style={{ boxShadow: `0 4px 12px ${palette.accentHighlight}88` }}
            />
          ) : (
            <div
              className="w-full h-72 rounded-md mb-3 flex items-center justify-center"
              style={{
                backgroundColor: palette.noPosterBg,
                color: palette.noPosterText,
                fontStyle: 'italic',
                fontWeight: '500',
              }}
            >
              No Poster
            </div>
          )}
          <h2
            className="text-lg font-semibold mb-1"
            style={{
              color: palette.primaryAccent,
              fontFamily: "'Playfair Display', serif",
              textShadow: `1px 1px 2px ${palette.accentHighlight}88`,
            }}
          >
            {movie.title}
          </h2>
        </Link>
      ))}
    </div>
  );

  if (loading)
    return (
      <div className="p-6" style={{ color: palette.primaryText }}>
        Loading Explore data...
      </div>
    );
  if (error)
    return (
      <div className="p-6" style={{ color: '#FF6B6B' }}>
        {error}
      </div>
    );

  return (
    <div
      className="min-h-screen p-6 transition-all duration-500 ease-in-out"
      style={{
        background: palette.background,
        color: palette.primaryText,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <h1
        className="text-4xl font-bold mb-10 text-center"
        style={{
          color: palette.primaryAccent,
          fontFamily: "'Playfair Display', serif",
          textShadow: `2px 2px 6px ${palette.accentHighlight}BB`,
        }}
      >
        Explore Movies
      </h1>

      {/* Popular */}
      <section className="mb-16">
        <h2
          className="text-3xl font-semibold mb-6"
          style={{
            color: palette.secondaryAccent,
            fontFamily: "'Playfair Display', serif",
            letterSpacing: '0.05em',
            textShadow: `1px 1px 4px ${palette.accentHighlight}AA`,
          }}
        >
          🔥 Popular Now
        </h2>
        {renderMovies(data.popular)}
      </section>

      {/* Top Rated */}
      <section className="mb-16">
        <h2
          className="text-3xl font-semibold mb-6"
          style={{
            color: palette.secondaryAccent,
            fontFamily: "'Playfair Display', serif",
            letterSpacing: '0.05em',
            textShadow: `1px 1px 4px ${palette.accentHighlight}AA`,
          }}
        >
          ⭐ Top Rated
        </h2>
        {renderMovies(data.top_rated)}
      </section>
    </div>
  );
}
