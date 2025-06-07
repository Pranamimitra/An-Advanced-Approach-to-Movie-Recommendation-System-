// import { createContext, useContext, useState } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => localStorage.getItem('user'));

//   const login = (username) => {
//     setUser(username);
//     localStorage.setItem('user', username);
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


// export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? { username: storedUser } : null;
  });

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', { username, password }, { withCredentials: true });
      setUser({ username });
      localStorage.setItem('user', username);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  const logout = async () => {
    try {
        await axios.post('http://127.0.0.1:5000/logout', {}, { withCredentials: true });
        setUser(null);
        localStorage.removeItem('user');
    } catch (err) {
        console.error('Logout failed:', err);
        setUser(null);
        localStorage.removeItem('user');
    }
};
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
