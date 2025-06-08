import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Explore from './pages/Explore';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Mood from './pages/Mood';
import Search from './pages/Search';
import Recommendations from './pages/Recommendations';
import Watchlist from './pages/Watchlist';
import WatchlistBasedRecommendation from './pages/Watchlist_based_recommendation';
import Chatbox from './components/chatbot';
import MovieDetails from './pages/MovieDetails';

function App() {
  const [isLightTheme, setIsLightTheme] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    if (isLightTheme) {
      root.classList.remove('dark');
      root.classList.add('light');  // optional, if you want to use a 'light' class
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  }, [isLightTheme]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen transition-colors duration-700 ease-in-out bg-red-200 dark:bg-black text-black dark:text-white">
          {/* Pass theme state and setter as props to Navbar */}
          <Navbar isLightTheme={isLightTheme} setIsLightTheme={setIsLightTheme} />

          <main className="flex-grow">
            <Routes>
              {/* Auth */}
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />

              {/* Main Pages */}
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore theme={isLightTheme ? 'light' : 'dark'} />} />
              <Route path="/about" element={<About />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/mood" element={<Mood />} />
              <Route path="/search" element={<Search />} />
              <Route path="/movie_details" element={<MovieDetails />} />
              <Route path="/watchlist" element={<Watchlist theme={isLightTheme ? 'light' : 'dark'} />} />
              <Route path="/watchlist-recommendations" element={<WatchlistBasedRecommendation />} />

              {/* Catch-All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />

           {/* Add your chatbot here so it shows on all pages */}
          <Chatbox />

        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
