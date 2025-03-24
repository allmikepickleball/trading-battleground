import React, { useState, useEffect, createContext, useContext } from 'react';
import { loginAdmin } from '../services/adminService';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if admin is logged in
    const checkAdminLoggedIn = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        
        if (token) {
          // Set auth token header
          // This would be handled in the api.js file
          
          // Get admin data from token
          const adminData = JSON.parse(localStorage.getItem('adminData'));
          
          if (adminData) {
            setAdmin(adminData);
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.error('Admin auth error:', err);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
      }
      
      setLoading(false);
    };
    
    checkAdminLoggedIn();
  }, []);

  // Login admin
  const login = async (username, password) => {
    setError(null);
    
    try {
      const data = await loginAdmin({ username, password });
      
      if (data.token) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminData', JSON.stringify(data.admin));
        
        setAdmin(data.admin);
        setIsAuthenticated(true);
        
        return true;
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      return false;
    }
  };

  // Logout admin
  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setAdmin(null);
    setIsAuthenticated(false);
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        isAuthenticated,
        loading,
        error,
        login,
        logout
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;
