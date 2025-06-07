import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Mood() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const mood = params.get('mood');

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!mood) {
        setError("No mood provided.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:5000/mood', {
          params: { mood },
        });
        setMovies(response.data.recommendations || []);
      } catch (err) {
        console.error("Failed to fetch mood-based recommendations:", err);
        setError("Error loading recommendations.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [mood]);

  const handleMovieClick = (title) => {
    navigate(`/movie_details?query=${encodeURIComponent(title)}`);
  };

  // ✅ Capitalize mood for heading
  const capitalizedMood = mood ? mood.charAt(0).toUpperCase() + mood.slice(1) : "";

  if (!mood) return <div className="p-6">Please select a mood to get recommendations.</div>;
  if (loading) return <div className="p-6">Loading movies for "{capitalizedMood}"...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!movies.length) return <div className="p-6">No recommendations found for "{capitalizedMood}".</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Mood-Based Recommendations: <span className="text-blue-600">{capitalizedMood}</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300"
            onClick={() => handleMovieClick(movie.title)}
          >
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`${movie.title} poster`}
                className="w-full h-72 object-cover rounded-md mb-3"
              />
            ) : (
              <div className="w-full h-72 bg-gray-300 dark:bg-gray-600 rounded-md mb-3 flex items-center justify-center text-gray-600 dark:text-gray-300">
                No Poster
              </div>
            )}
            <h2 className="text-lg font-semibold mb-1">{movie.title}</h2>
            {movie.overview && (
              <p className="text-sm text-gray-700 dark:text-gray-300 italic line-clamp-3">
                {movie.overview.length > 150
                  ? movie.overview.slice(0, 150) + '...'
                  : movie.overview}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
