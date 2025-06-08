import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Example: receive theme toggle prop (true for light theme, false for dark theme)
export default function WatchlistBasedRecommendation({ isLightTheme }) {
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/recommend_from_watchlist', {
          withCredentials: true,
        });
        setRecommendations(response.data.recommendations || []);
      } catch (err) {
        console.error('Error fetching watchlist-based recommendations:', err);
        setError('Failed to fetch recommendations.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleMovieClick = (title) => {
    navigate(`/search?query=${encodeURIComponent(title)}`);
  };

  // Define colors from your palette:
  const colors = {
    darkBg: '#1A1A1A', // Smoky Charcoal
    cardBg: '#2D2D2D', // Film Gray
    primaryText: '#F5F3E7', // Soft Ivory
    secondaryText: '#A89F91', // Dusty Taupe
    primaryAccent: '#7B2D26', // Vintage Maroon
    secondaryAccent: '#C9B458', // Faded Gold
    accentHighlight: '#8B6A4F', // Sepia Accent

    // Light theme (dreamy pinks)
    lightBg: '#FFF0F6',
    lightCardBg: '#FFE6F0',
    lightPrimaryText: '#5B2C49',
    lightSecondaryText: '#9E647B',
    lightPrimaryAccent: '#D96CA4',
    lightSecondaryAccent: '#F6C0D0',
    lightAccentHighlight: '#FADADD',
  };

  // Conditional classes for themes
  const bgColor = isLightTheme ? colors.lightBg : colors.darkBg;
  const cardBgColor = isLightTheme ? colors.lightCardBg : colors.cardBg;
  const textPrimaryColor = isLightTheme ? colors.lightPrimaryText : colors.primaryText;
  const textSecondaryColor = isLightTheme ? colors.lightSecondaryText : colors.secondaryText;
  const primaryAccent = isLightTheme ? colors.lightPrimaryAccent : colors.primaryAccent;
  const secondaryAccent = isLightTheme ? colors.lightSecondaryAccent : colors.secondaryAccent;
  const accentHighlight = isLightTheme ? colors.lightAccentHighlight : colors.accentHighlight;

  // Font families: Playfair Display for titles, DM Sans for body
  // Make sure you import fonts in index.html or via Tailwind config

  if (loading)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <div
          className="text-2xl font-semibold animate-pulse"
          style={{ color: primaryAccent, fontFamily: "'Playfair Display', serif" }}
        >
          Loading recommendations...
        </div>
      </div>
    );

  if (error)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <div
          className="text-xl font-semibold"
          style={{ color: '#E63946', fontFamily: "'DM Sans', sans-serif" }}
        >
          {error}
        </div>
      </div>
    );

  if (!recommendations.length)
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ backgroundColor: bgColor, color: textSecondaryColor, fontFamily: "'DM Sans', sans-serif" }}
      >
        <h2
          className="text-3xl font-bold mb-4"
          style={{ color: primaryAccent, fontFamily: "'Playfair Display', serif" }}
        >
          No recommendations found based on your watchlist.
        </h2>
        <p>Add more movies to your watchlist and try again!</p>
      </div>
    );

  return (
    <div
      className="min-h-screen py-12 px-6 sm:px-12"
      style={{ backgroundColor: bgColor, fontFamily: "'DM Sans', sans-serif" }}
    >
      <h1
        className="text-5xl font-extrabold text-center mb-12 tracking-wide drop-shadow-lg"
        style={{ color: primaryAccent, fontFamily: "'Playfair Display', serif" }}
      >
        Recommendations Based on Your Watchlist
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
        {recommendations.map((movie, idx) => (
          <div
            key={idx}
            onClick={() => handleMovieClick(movie.title)}
            className="cursor-pointer overflow-hidden rounded-3xl shadow-lg transition-transform duration-300 ease-in-out"
            style={{
              backgroundColor: cardBgColor,
              boxShadow: `0 8px 24px ${accentHighlight}80`,
              border: `1px solid ${secondaryAccent}80`,
              filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.3))',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = `0 12px 30px ${primaryAccent}aa`;
              e.currentTarget.style.borderColor = primaryAccent;
              e.currentTarget.style.cursor = 'pointer';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = `0 8px 24px ${accentHighlight}80`;
              e.currentTarget.style.borderColor = `${secondaryAccent}80`;
            }}
            title={movie.title}
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : 'https://via.placeholder.com/500x750?text=No+Poster'
              }
              alt={`${movie.title} poster`}
              className="w-full h-80 object-cover rounded-t-3xl"
              style={{ boxShadow: `inset 0 -30px 40px ${bgColor}` }}
            />
            <div className="p-5 flex flex-col gap-3" style={{ color: textPrimaryColor }}>
              <h3
                className="font-bold text-xl leading-tight truncate"
                style={{ color: primaryAccent, fontFamily: "'Playfair Display', serif" }}
              >
                {movie.title}
              </h3>

              {/* Genres as badges */}
              <div className="flex flex-wrap gap-2 text-sm" style={{ color: textSecondaryColor }}>
                {(movie.genres || 'Unknown Genre').split(', ').map((genre, idx) => (
                  <span
                    key={idx}
                    className="rounded-full px-3 py-1 shadow-sm"
                    style={{
                      backgroundColor: secondaryAccent + 'cc',
                      border: `1px solid ${accentHighlight}cc`,
                      color: textPrimaryColor,
                      fontWeight: '600',
                      letterSpacing: '0.05em',
                      userSelect: 'none',
                      fontSize: '0.75rem',
                      textShadow: `0 1px 1px ${accentHighlight}aa`,
                      transition: 'background-color 0.3s ease-in-out',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = primaryAccent)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = secondaryAccent + 'cc')}
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Overview with line clamp */}
              <p
                className="text-sm leading-relaxed italic"
                style={{ color: textSecondaryColor }}
                title={movie.overview || 'No description available'}
              >
                {movie.overview || 'No description available.'}
              </p>

              {/* Based on which movie/feature */}
              {movie.reason && (
                <p
                  className="mt-2 text-xs italic select-none"
                  style={{ color: secondaryAccent }}
                >
                  🎯 Based on: {movie.reason}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
