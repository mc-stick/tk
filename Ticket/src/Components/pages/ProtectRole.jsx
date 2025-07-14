import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" />; // No logueado, redirige a home

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />; // Rol no autorizado
  }

  return children;
};

export default ProtectedRoute;
