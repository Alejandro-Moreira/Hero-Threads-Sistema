import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthRoute = ({ children, user }) => {
  // If user is already authenticated, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthRoute; 