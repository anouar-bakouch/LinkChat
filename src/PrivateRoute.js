import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectAuthToken } from './features/auth/authSlice';

function PrivateRoute({ children }) {
  const token = useSelector(selectAuthToken);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;