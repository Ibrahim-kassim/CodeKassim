import { Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to={`/${ROUTES.Auth}`} replace />;
  }

  return <>{children}</>;
};
