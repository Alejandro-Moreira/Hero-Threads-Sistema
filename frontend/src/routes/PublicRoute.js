import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children, user }) => {
  // Public routes are accessible to everyone
  return children;
};

export default PublicRoute; 