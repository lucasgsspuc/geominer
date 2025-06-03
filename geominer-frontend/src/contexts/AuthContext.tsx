import { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/AuthService';

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  checkAuth: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const user = await AuthService.getProfile();
      setUser(user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  const login = async (username: string, password: string) => {
    await AuthService.login({ username, password });
    await checkAuth();
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, checkAuth, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
