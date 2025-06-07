import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MovieDetails = ({ theme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const params = new URLSearchParams(location.search);
  const title = params.get('query');

  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [watchlistMessage, setWatchlistMessage] = useState('');
  const [rating, setRating] = useState('');
  const [status, setStatus] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [addedToWatchlist, setAddedToWatchlist] = useState(false);

  useEffect(() => {
    if (!title) {
      setError('No search query provided.');
      return;
    }

    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/movie_details', {
          params: { query: title }
        });
        if (response.data.results && response.data.results.length > 0) {
  setMovie(response.data.results[0]);
} else {
  setError("Movie not found.");
}
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Movie not found or server error.');
      }
    };

    fetchMovieDetails();
  }, [title]);

  const handleFindSimilar = () => {
    navigate(`/recommendations?movie=${encodeURIComponent(title)}`);
  };

  const handleAddToWatchlist = async () => {
    if (!user) {
      navigate("/signup");
      return;
    }

    try {
      const payload = {
        title: movie.title,
        poster_path: movie.poster_path,
        username: user.username,
        status: status || 'Plan to Watch',
        rating: rating ? parseInt(rating) : null
      };

      const response = await axios.post("http://127.0.0.1:5000/watchlist/add", payload, {
        withCredentials: true,
      });

      if (response.status === 201) {
        setWatchlistMessage("✨ Movie added to watchlist!");
        setAddedToWatchlist(true);
      } else {
        setWatchlistMessage("Something went wrong.");
      }
    } catch (err) {
      console.error("Failed to add to watchlist:", err);
      setWatchlistMessage("Failed to add movie to watchlist.");
    }
  };

  if (error)
    return (
      <div
        className={`p-6 font-body text-sm ${
          theme === 'dark' ? 'text-vintageMaroon' : 'text-dreamyPink'
        }`}
      >
        {error}
      </div>
    );
  if (!movie)
    return (
      <div
        className={`p-6 font-body text-lg ${
          theme === 'dark' ? 'text-softIvory' : 'text-dreamyPink'
        }`}
      >
        Loading...
      </div>
    );

  return (
    <div
      className={`p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 rounded-xl
      ${
        theme === 'dark'
          ? 'bg-smoky shadow-subtle text-softIvory font-body'
          : 'bg-dreamyPinkBg shadow-lg text-dreamyPink font-body'
      }`}
    >
      {/* Left Panel */}
<div
  className={`p-4 rounded-3xl ${
    theme === 'dark' ? 'bg-filmGray shadow-subtle' : 'bg-white bg-opacity-80'
  }`}
>
  <img
    src={
      movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '/placeholder.jpg'
    }
    alt={movie.title}
    className="rounded-3xl shadow-2xl w-full mb-6 transition-transform duration-500 ease-smooth hover:scale-105"
  />

  <div
    className={`space-y-3 text-sm ${
      theme === 'dark' ? 'text-dustyTaupe' : 'text-vintageMaroon'
    }`}
  >
    <p>
      <strong className={`${theme === 'dark' ? 'text-fadedGold' : 'text-warmGold'}`}>
        Release Date:
      </strong>{' '}
      {movie.release_date || 'N/A'}
    </p>
    <p>
      <strong className={`${theme === 'dark' ? 'text-fadedGold' : 'text-warmGold'}`}>
        Runtime:
      </strong>{' '}
      {movie.runtime || 'N/A'} mins
    </p>
    <p>
      <strong className={`${theme === 'dark' ? 'text-fadedGold' : 'text-warmGold'}`}>
        Original Title:
      </strong>{' '}
      {movie.original_title || 'N/A'}
    </p>
    <p>
      <strong className={`${theme === 'dark' ? 'text-fadedGold' : 'text-warmGold'}`}>
        Adult:
      </strong>{' '}
      {movie.adult ? 'Yes' : 'No'}
    </p>
    <p>
      <strong className={`${theme === 'dark' ? 'text-fadedGold' : 'text-warmGold'}`}>
        Languages:
      </strong>{' '}
      {movie.spoken_languages || 'N/A'}
    </p>
    <p>
      <strong className={`${theme === 'dark' ? 'text-fadedGold' : 'text-warmGold'}`}>
        Countries:
      </strong>{' '}
      {movie.production_countries || 'N/A'}
    </p>
    <p>
      <strong className={`${theme === 'dark' ? 'text-fadedGold' : 'text-warmGold'}`}>
        Budget:
      </strong>{' '}
      ${movie.budget || 'N/A'}
    </p>
    <p>
      <strong className={`${theme === 'dark' ? 'text-fadedGold' : 'text-warmGold'}`}>
        Revenue:
      </strong>{' '}
      ${movie.revenue || 'N/A'}
    </p>
    <p>
      <strong className={`${theme === 'dark' ? 'text-fadedGold' : 'text-warmGold'}`}>
        Votes:
      </strong>{' '}
      {movie.vote_count}
    </p>
    <p>
      <strong className={`${theme === 'dark' ? 'text-fadedGold' : 'text-warmGold'}`}>
        Average Rating:
      </strong>{' '}
      {movie.vote_average}
    </p>
  </div>
</div>

      {/* Right Panel */}
      <div>
        <h1
          className={`text-5xl font-title mb-4 transition-colors duration-500 ease-smooth ${
            theme === 'dark' ? 'text-vintageMaroon' : 'text-dreamyPink'
          }`}
        >
          {movie.title}
        </h1>

        <p
          className={`text-lg italic mb-6 ${
            theme === 'dark' ? 'text-sepiaAccent' : 'text-dreamyPinkSecondary'
          }`}
        >
          {movie.tagline}
        </p>

        {/* Watchlist Interaction Section */}
        {user && (
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-8 items-center justify-start">
            {/* Add to Watchlist Button */}
            <button
              onClick={handleAddToWatchlist}
              className={`px-6 py-3 font-semibold rounded-full transition-all duration-300 ease-smooth border-2 text-sm sm:text-base
                ${
                  addedToWatchlist
                    ? theme === 'dark'
                      ? 'bg-gradient-to-r from-vintageMaroon to-fadedGold text-smokyCharcoal border-fadedGold hover:from-fadedGold hover:to-vintageMaroon'
                      : 'bg-gradient-to-r from-dreamyPinkPrimary to-dreamyPinkAccent text-dreamyPinkBg border-dreamyPinkPrimary hover:from-dreamyPinkAccent hover:to-dreamyPinkPrimary'
                    : theme === 'dark'
                    ? 'bg-transparent border-fadedGold text-fadedGold hover:bg-fadedGold hover:text-smokyCharcoal'
                    : 'bg-transparent border-dreamyPinkPrimary text-dreamyPink hover:bg-dreamyPinkPrimary hover:text-dreamyPinkBg'
                }
              `}
            >
              {addedToWatchlist ? '✔️ Added to Watchlist' : '➕ Add to Watchlist'}
            </button>

            {/* Set Status Dropdown */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`px-5 py-3 rounded-3xl font-body text-base font-medium transition-all duration-300 ease-in-out border shadow-md focus:outline-none focus:ring-4
                ${
                  theme === 'dark'
                    ? 'bg-filmGray text-fadedGold border-sepiaAccent focus:ring-fadedGold'
                    : 'bg-pink-50 text-rose-700 border-pink-300 focus:ring-pink-400'
                }
              `}
            >
              <option value="">🎯 Set Status</option>
              <option value="watching">🎬 Watching</option>
              <option value="plan">📝 Plan to Watch</option>
              <option value="completed">✅ Completed</option>
              <option value="dropped">❌ Dropped</option>
            </select>

            {/* Rating Dropdown */}
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className={`px-5 py-3 rounded-3xl font-body text-base font-medium transition-all duration-300 ease-in-out border shadow-md focus:outline-none focus:ring-4
                ${
                  theme === 'dark'
                    ? 'bg-filmGray text-vintageMaroon border-vintageMaroon focus:ring-vintageMaroon'
                    : 'bg-pink-50 text-rose-700 border-pink-300 focus:ring-pink-400'
                }
              `}
            >
              <option value="">⭐ Rate</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}/10
                </option>
              ))}
            </select>
          </div>
        )}

        {watchlistMessage && (
          <p
            className={`mb-6 font-semibold ${
              theme === 'dark' ? 'text-fadedGold' : 'text-dreamyPink'
            }`}
          >
            {watchlistMessage}
          </p>
        )}

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          {['overview', 'cast'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full font-semibold shadow-md transition-all duration-300 ease-smooth
                ${
                  activeTab === tab
                    ? theme === 'dark'
                      ? 'bg-vintageMaroon text-softIvory shadow-soft-glow'
                      : 'bg-dreamyPinkPrimary text-dreamyPinkBg shadow-md'
                    : theme === 'dark'
                    ? 'bg-filmGray text-fadedGold hover:bg-vintageMaroon hover:text-softIvory'
                    : 'bg-pink-100 text-dreamyPink hover:bg-dreamyPinkAccent hover:text-white'
                }
              `}
            >
              {tab === 'overview' ? '📖 Overview' : '🎭 Cast & Crew'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
  className={`rounded-xl p-6
    ${
      theme === 'dark'
        ? 'bg-smoky text-fadedGold shadow-subtle'
        : 'bg-white text-dustyRose shadow-md'
    }
  `}
  style={{ minHeight: '180px' }}
>

          {activeTab === 'overview' ? (
            <>
              <h2 className="text-2xl font-title mb-4">{movie.title} Overview</h2>
              <p className="font-body leading-relaxed">{movie.overview || 'No overview available.'}</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-title mb-4">Cast & Crew</h2>
              <p>
                <strong>Cast:</strong> {movie.cast?.join(', ') || 'N/A'}
              </p>
              <p>
                <strong>Directors:</strong> {movie.directors || 'N/A'}
              </p>
              <p>
                <strong>Writers:</strong> {movie.writers || 'N/A'}
              </p>
              <p>
                <strong>Production Companies:</strong> {movie.production_companies || 'N/A'}
              </p>
            </>
          )}
        </div>

        {/* Similar Button */}
        <div className="mt-10">
          <button
            onClick={handleFindSimilar}
            className={`w-full px-8 py-4 font-semibold rounded-full shadow-xl transition-all duration-300 ease-smooth
              ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-vintageMaroon to-fadedGold text-smokyCharcoal hover:from-fadedGold hover:to-vintageMaroon'
                  : 'bg-gradient-to-r from-dreamyPinkPrimary to-dreamyPinkAccent text-dreamyPinkBg hover:from-dreamyPinkAccent hover:to-dreamyPinkPrimary'
              }
            `}
          >
            ✨ Find Similar Movies
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
