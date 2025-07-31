import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, user, requiredRole = null }) => {
  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Check if specific role is required
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute; 