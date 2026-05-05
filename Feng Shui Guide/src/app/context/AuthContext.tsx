import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../../lib/api";
import { toast } from "sonner";

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  role_display?: string;
  avatar_url?: string;
  birthday?: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  updateUser: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(false);

  // Sync token to API defaults
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Validate session on load
  useEffect(() => {
    if (token && !user) {
      api.get("/auth/me")
        .then((res) => {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        })
        .catch(() => logout());
    }
  }, []);

  const login = async (credentials: any) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", credentials);
      const { token: t, user: u } = res.data;
      setToken(t);
      setUser(u);
      localStorage.setItem("token", t);
      localStorage.setItem("user", JSON.stringify(u));
      toast.success(`Chào mừng trở lại, ${u.full_name}!`);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Đăng nhập thất bại";
      toast.error(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      await api.post("/auth/register", data);
      toast.success("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Đăng ký thất bại";
      toast.error(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    toast.success("Đã đăng xuất thành công");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, updateUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
