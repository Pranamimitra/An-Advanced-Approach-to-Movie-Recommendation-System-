import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const title = params.get('query');

  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!title) {
      setError('No search query provided.');
      setResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/search', {
          params: { query: title }
        });

        if (response.data.results) {
          console.log('Fetched movies:', response.data.results);

          // Sort by popularity descending
          const sortedResults = [...response.data.results].sort(
            (a, b) => Number(b.popularity || 0) - Number(a.popularity || 0)
          );

          console.log('Sorted movies by popularity:');
          sortedResults.forEach(m => console.log(m.title, m.popularity));

          setResults(sortedResults);
          setError(null);
        } else {
          setError('No results found.');
          setResults([]);
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('Movie not found or server error.');
        setResults([]);
      }
    };

    fetchSearchResults();
  }, [title]);

  if (error)
    return (
      <div className="p-6 text-vintage-maroon text-center font-semibold text-lg">
        {error}
      </div>
    );
  if (!results.length)
    return (
      <div className="p-6 text-faded-gold text-center font-medium text-lg">
        Loading...
      </div>
    );

  return (
    <div className="p-6 bg-smoky-charcoal min-h-screen text-soft-ivory font-inter">
      <h1 className="text-4xl font-playfair mb-8 text-vintage-maroon text-center">
        Search Results for{' '}
        <span className="text-faded-gold">"{title}"</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {results.map((movie, index) => (
          <div
            key={index}
            className="bg-film-gray rounded-lg shadow-lg overflow-hidden cursor-pointer transition-shadow duration-300 ease-in-out hover:shadow-sepia-accent hover:bg-gray-700"
            onClick={() => navigate(`/movie_details?query=${encodeURIComponent(movie.title)}`)}
          >
            {movie.poster_path && movie.poster_path !== 'NA' && (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`${movie.title} poster`}
                className="w-full h-80 object-cover"
              />
            )}
            <div className="p-5">
              <h2 className="text-2xl font-playfair mb-3 text-vintage-maroon">
                {movie.title}
              </h2>
              <p className="text-dusty-taupe text-sm mb-3 line-clamp-3">
                {movie.overview || 'No description available.'}
              </p>
              <div className="flex justify-between items-center text-faded-gold text-sm font-medium">
                <span>
                  Popularity:{' '}
                  {Number.isFinite(Number(movie.popularity))
                    ? Number(movie.popularity).toFixed(1)
                    : 'N/A'}
                </span>

                {(movie.genres && Array.isArray(movie.genres)) && (
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre, i) => (
                      <span
                        key={i}
                        className="bg-faded-gold bg-opacity-30 rounded-full px-3 py-1"
                      >
                        {typeof genre === 'string' ? genre : genre.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;


/* You can extend your Tailwind config with these colors under theme.extend.colors */

