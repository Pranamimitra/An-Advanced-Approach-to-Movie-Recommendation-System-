import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const WatchlistButton = ({ movie }) => {
  const { user, theme } = useAuth(); // Assuming your AuthContext provides theme as well
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    const checkIfInWatchlist = async () => {
      if (!user || !movie?.title) return;
      try {
        const response = await axios.get('http://127.0.0.1:5000/watchlist', {
          params: { username: user.username },
          withCredentials: true,
        });

        const isInWatchlist = response.data.watchlist?.some(
          (m) => m.title === movie.title
        );
        setInWatchlist(isInWatchlist);
      } catch (err) {
        console.error('Error checking watchlist:', err);
      }
    };

    checkIfInWatchlist();
  }, [user, movie]);

  const toggleWatchlist = async () => {
    if (!user) return;

    try {
      if (inWatchlist) {
        await axios.post(
          'http://127.0.0.1:5000/watchlist/remove',
          { username: user.username, movie_title: movie.title },
          { withCredentials: true }
        );
        setInWatchlist(false);
        toast.success('Removed from Watchlist');
      } else {
        await axios.post(
          'http://127.0.0.1:5000/watchlist/add',
          { username: user.username, movie },
          { withCredentials: true }
        );
        setInWatchlist(true);
        toast.success('Added to Watchlist');
      }
    } catch (err) {
      toast.error('Failed to update watchlist');
      console.error('Watchlist error:', err);
    }
  };

  return (
    <button
      onClick={toggleWatchlist}
      className={`
        relative
        px-6
        py-3
        rounded-full
        font-playfair
        font-semibold
        transition
        duration-400
        ease-in-out
        select-none
        shadow-md
        focus:outline-none
        focus:ring-2
        focus:ring-offset-1
        focus:ring-fadedGold
        ${
          theme === 'dark'
            ? inWatchlist
              ? 'bg-vintageMaroon text-softIvory hover:bg-sepiaAccent shadow-[0_4px_15px_rgba(123,45,38,0.7)]'
              : 'bg-filmGray text-fadedGold hover:bg-sepiaAccent hover:text-softIvory shadow-[0_4px_15px_rgba(201,180,88,0.7)]'
            : inWatchlist
            ? 'bg-pink-600 text-pink-50 hover:bg-pink-700 shadow-[0_6px_15px_rgba(219,112,147,0.7)]'
            : 'bg-pink-200 text-vintageMaroon hover:bg-pink-300 hover:text-pink-900 shadow-[0_6px_15px_rgba(219,112,147,0.5)]'
        }
      `}
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      {inWatchlist ? '✔ In Watchlist' : '+ Add to Watchlist'}
      {/* Optional subtle glow pulse animation for added charm */}
      {inWatchlist && (
        <span
          aria-hidden="true"
          className={`absolute -inset-1 rounded-full opacity-50 animate-pulse
            ${theme === 'dark' ? 'bg-sepiaAccent' : 'bg-pink-300'}`}
          style={{ filter: 'blur(6px)' }}
        />
      )}
    </button>
  );
};

export default WatchlistButton;
