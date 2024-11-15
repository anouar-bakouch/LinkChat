import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ element }) => {
  const token = useSelector((state) => state.user.token);
  return token ? element : <Navigate to="/login" />;

};

export default PrivateRoute;