import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
  const token = localStorage.getItem('token'); 

  if (!token) {
    // If no token, redirect to login page
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;