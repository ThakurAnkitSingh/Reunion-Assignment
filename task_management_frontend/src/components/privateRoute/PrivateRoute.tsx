import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
  const token = localStorage.getItem('token'); // Get token from localStorage

  if (!token) {
    // If no token, redirect to login page
    return <Navigate to="/login" />;
  }

  return <Outlet />; // If authenticated, allow access to the route
};

export default PrivateRoute;