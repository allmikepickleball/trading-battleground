import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdmin();

  if (loading) {
    // You could render a loading spinner here
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default AdminRoute;
