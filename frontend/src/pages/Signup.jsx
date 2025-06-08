import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from the context
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.status === 201) {
        // Automatically log the user in after a successful signup
        // login(formData.username);
        setMessage('Account created! Redirecting...');
        setTimeout(() => navigate('/'), 1500); // Redirect to the home/dashboard page
      } else {
        setMessage(data.message || 'Signup failed.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all">
      <div className="w-full max-w-md bg-white dark:bg-gray-950 shadow-2xl rounded-3xl p-10 backdrop-blur-md border border-gray-200 dark:border-gray-800">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-8">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:from-purple-600 hover:to-pink-500 transition-all duration-300 shadow-md"
          >
            Sign Up
          </button>
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-pink-500 font-medium transition">
              Log in
            </Link>
          </p>
        </form>
        {message && (
          <p className="mt-6 text-center text-sm text-red-500 dark:text-red-400">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Signup;
