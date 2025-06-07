import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const Watchlist = ({ theme }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [showRecModal, setShowRecModal] = useState(false);
  const [recLoading, setRecLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchWatchlist = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:5000/watchlist', {
          params: { username: user.username },
          withCredentials: true,
        });
        setWatchlist(response.data.watchlist || []);
        setUserInfo(response.data.user || null);
        setStats(response.data.stats || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load watchlist');
        console.error('Fetch watchlist error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [user, navigate]);

  const handleRemoveFromWatchlist = async (movieTitle) => {
    try {
      await axios.post(
        'http://127.0.0.1:5000/watchlist/remove',
        { username: user.username, movie_title: movieTitle },
        { withCredentials: true }
      );
      setWatchlist(watchlist.filter((movie) => movie.title !== movieTitle));
      toast.success('Movie removed from watchlist!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to remove movie';
      toast.error(errorMessage);
    }
  };

  const fetchRecommendations = async () => {
    if (watchlist.length < 2) {
      toast.info('Add at least 2 movies to your watchlist for better recommendations!');
      return;
    }
    try {
      setRecLoading(true);
      const response = await axios.get('http://127.0.0.1:5000/recommend_from_watchlist', {
        params: { username: user.username },
        withCredentials: true,
      });
      if (response.data.message) {
        toast.info(response.data.message);
      }
      setRecommendations(response.data.recommendations || []);
      setShowRecModal(true);
    } catch (err) {
      toast.error('Failed to fetch recommendations');
    } finally {
      setRecLoading(false);
    }
  };

  const handleRecommendationClick = (title) => {
    setShowRecModal(false);
    navigate(`/search?query=${encodeURIComponent(title)}`);
  };

  const handleCardClick = (title) => {
    navigate(`/movie_details?query=${encodeURIComponent(title)}`);
  };

  const isDark = theme === 'dark';
  const bg = isDark ? 'bg-[#1A1A1A]' : 'bg-pink-100';
  const textPrimary = isDark ? 'text-[#F5F3E7]' : 'text-pink-800';
  const textSecondary = isDark ? 'text-[#A89F91]' : 'text-pink-500';
  const cardBg = isDark ? 'bg-[#2D2D2D]' : 'bg-white';
  const accent = isDark ? 'text-[#C9B458]' : 'text-pink-600';
  const highlight = isDark ? 'hover:shadow-[#8B6A4F]/70' : 'hover:shadow-pink-300';

  if (!user) return null;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-2xl animate-pulse font-display">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-red-400 text-xl font-body">{error}</div>
      </div>
    );

    
  return (
    
    <div className={`min-h-screen ${bg} py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-700`}>
      <div className="max-w-7xl mx-auto font-body">
        <h1 className={`text-5xl font-display text-center mb-10 tracking-wide ${textPrimary}`}>
          Your Watchlist
        </h1>

        {userInfo && stats && (
  <div
    className={`rounded-xl shadow-lg p-6 mb-10 max-w-3xl mx-auto transition-colors duration-500 ${
      isDark ? 'bg-[#2D2D2D] text-[#D99CA6]' : 'bg-white text-dustyRose-800'
    }`}
  >
    <h2 className={`text-2xl font-semibold mb-4 ${isDark ? '' : 'text-dustyRose-900'}`}>
      Welcome, {userInfo.username}!
    </h2>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
      {["total", "Plan to Watch", "Watching", "Completed"].map((key) => (
        <div key={key}>
          <p className="text-lg font-bold">{stats[key]}</p>
          <p className={`text-sm ${isDark ? 'text-[#A89F91]' : 'text-dustyRose-500'}`}>{key}</p>
        </div>
      ))}
    </div>
  </div>
)}


        {watchlist.length === 0 ? (
          <div className={`${textSecondary} text-xl text-center`}>
            Your watchlist is empty.{' '}
            <a href="/explore" className={`${accent} underline font-semibold hover:opacity-80`}>
              Explore movies to add some!
            </a>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-8">
              <button
                onClick={fetchRecommendations}
                disabled={recLoading}
                className={`px-8 py-3 rounded-full bg-[#C9B458] text-[#1A1A1A] font-semibold shadow-lg hover:bg-[#bca54d] transition-all duration-300 ${
                  recLoading ? 'cursor-not-allowed opacity-70' : ''
                }`}
              >
                {recLoading ? 'Fetching Recommendations...' : 'Get Recommendations'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <AnimatePresence>
                {watchlist.map((movie, index) => (
                  <motion.div
                    key={movie.title}
                    onClick={() => handleCardClick(movie.title)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.07 }}
                    className={`relative ${cardBg} rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-shadow duration-300 ${highlight}`}
                  >
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : 'https://via.placeholder.com/500x750?text=No+Poster'
                      }
                      alt={`${movie.title} poster`}
                      className="w-full h-96 object-cover rounded-t-2xl"
                    />
                    <div className="p-5">
                      <h2 className={`text-xl font-semibold truncate font-display ${textPrimary}`} title={movie.title}>
                        {movie.title}
                      </h2>
                      <p className={`text-sm mt-1 truncate ${textSecondary}`} title={movie.genres || 'Unknown Genre'}>
                        {movie.genres || 'Unknown Genre'}
                      </p>
                      <p className={`mt-2 text-sm line-clamp-4 ${textPrimary}`} title={movie.overview || 'No description available.'}>
                        {movie.overview || 'No description available.'}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromWatchlist(movie.title);
                        }}
                        className="mt-4 w-full py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 shadow-md"
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
      {showRecModal && (
  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 z-50 flex justify-center items-center">
    <div
      className={`p-8 rounded-2xl max-w-3xl w-full shadow-xl overflow-y-auto max-h-[90vh] transition-colors duration-500 ${
        isDark ? 'bg-[#2D2D2D] text-[#F5F3E7]' : 'bg-pink-100 text-pink-800'
      }`}
    >
      <h2 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-[#F5F3E7]' : 'text-pink-800'}`}>
        Recommended Movies
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {recommendations.map((movie, index) => (
          <div
            key={index}
            className="cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => handleRecommendationClick(movie.title)}
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : 'https://via.placeholder.com/500x750?text=No+Poster'
              }
              alt={movie.title}
              className="rounded-lg w-full h-72 object-cover"
            />
            <p
              className={`mt-2 text-center text-sm font-medium ${
                isDark ? 'text-[#C9B458]' : 'text-pink-700'
              }`}
            >
              {movie.title}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={() => setShowRecModal(false)}
          className={`px-6 py-2 rounded-full transition-colors font-semibold ${
            isDark
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-pink-500 text-white hover:bg-pink-600'
          }`}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Watchlist;
