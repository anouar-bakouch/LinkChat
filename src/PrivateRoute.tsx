import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectAuthToken } from './features/auth/authSlice';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = useSelector(selectAuthToken) || localStorage.getItem('authToken');

  console.log('PrivateRoute token:', token);

  if (!token) {
    console.log('No token found, redirecting to /login');
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;