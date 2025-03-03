import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ user }) => {
    const userData = JSON.parse(localStorage.getItem('user'));
  return userData ? <Outlet /> : <Navigate to="/auth/register" />;
};

export default PrivateRoute;
