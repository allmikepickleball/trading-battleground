import React, { createContext, useContext, useState, useEffect } from 'react';
import { register, login, getCurrentUser, updateProfile } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from token on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const userData = await getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem('token');
        setError(err.message || 'Authentication error');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register user
  const registerUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await register(userData);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const loginUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await login(userData);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateProfile(profileData);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message || 'Profile update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        registerUser,
        loginUser,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
