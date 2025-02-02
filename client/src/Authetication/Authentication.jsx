import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  useEffect(() => {
    const token = localStorage.getItem('blog_user');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log(decoded);
        setUser(decoded);  
      } catch (error) {
        console.error('Invalid token', error);
      }
    }
    setLoading(false); // After checking, set loading to false
  }, []);

  const login = (token) => {
    const decoded = jwtDecode(token);
    setUser(decoded.data);
    localStorage.setItem('blog_user', token); // Store the token in localStorage
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('blog_user'); 
    
  };

  if (loading) {
    return <div>Loading...</div>; // Render loading indicator while checking the token
  }

  return (
    <AuthContext.Provider value={{ user, login, signOut,setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};
