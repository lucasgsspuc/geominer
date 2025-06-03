import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Verificando autenticação...</p>;
  if (!user) return <Navigate to="/" />;

  return <>{children}</>;
};
