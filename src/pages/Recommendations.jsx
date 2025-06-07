import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Recommendations() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const movieTitle = params.get('movie');

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!movieTitle) {
        setError('No movie title provided.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:5000/recommendations', {
          params: { movie: movieTitle },
        });
        setRecommendations(response.data.recommendations || []);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to fetch similar movies.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [movieTitle]);

  const handleMovieClick = (title) => {
    navigate(`/movie_details?query=${encodeURIComponent(title)}`);
  };

  if (loading)
    return (
      <div className="p-8 text-lg text-softIvory font-body flex justify-center items-center min-h-[60vh]">
        Loading recommendations for <strong className="ml-2 text-vintageMaroon">{movieTitle}</strong>...
      </div>
    );

  if (error)
    return (
      <div className="p-8 text-center text-fadedGold font-body font-semibold min-h-[60vh]">
        {error}
      </div>
    );

  if (!recommendations.length)
    return (
      <div className="p-8 text-softIvory font-body text-center min-h-[60vh]">
        No similar movies found for <strong className="text-vintageMaroon">{movieTitle}</strong>.
      </div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-title font-bold mb-10 text-center text-vintageMaroon drop-shadow-lg">
        Similar Movies to <span className="text-fadedGold italic">{movieTitle}</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {recommendations.map((movie, index) => (
          <div
            key={index}
            onClick={() => handleMovieClick(movie.title)}
            className="bg-filmGray rounded-2xl shadow-lg cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-[1.05] hover:shadow-[0_8px_24px_rgba(139,106,79,0.6)]"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleMovieClick(movie.title)}
          >
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`${movie.title} poster`}
                className="w-full h-80 object-cover rounded-t-2xl"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-80 bg-[#4a4340] rounded-t-2xl flex items-center justify-center text-sepiaAccent font-semibold text-lg italic">
                No Poster
              </div>
            )}

            <div className="p-5">
              <h2 className="text-xl font-title font-semibold mb-2 text-softIvory transition-colors duration-300 hover:text-vintageMaroon">
                {movie.title}
              </h2>
              {movie.overview && (
                <p className="text-dustyTaupe text-sm italic line-clamp-3 select-none">
                  {movie.overview.length > 150
                    ? movie.overview.slice(0, 150) + '...'
                    : movie.overview}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
