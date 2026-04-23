import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  role_display: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  hasRole: (minRole: string) => boolean;
}

const ROLE_LEVELS: Record<string, number> = {
  viewer: 1, editor: 2, admin: 3, super_admin: 4,
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('admin_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin_token'));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      api.get('/auth/me').then(res => {
        setUser(res.data.user);
        localStorage.setItem('admin_user', JSON.stringify(res.data.user));
      }).catch(() => logout());
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: t, user: u } = res.data;
      localStorage.setItem('admin_token', t);
      localStorage.setItem('admin_user', JSON.stringify(u));
      setToken(t);
      setUser(u);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setUser(null);
  };

  const hasRole = (minRole: string): boolean => {
    if (!user) return false;
    return (ROLE_LEVELS[user.role] || 0) >= (ROLE_LEVELS[minRole] || 0);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
