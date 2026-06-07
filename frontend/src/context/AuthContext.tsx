import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

type Tokens = { access: string; refresh: string };
type User = { id: string; email: string; roles?: string[] };

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Initialise from localStorage
  useEffect(() => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");
    if (access && refresh) {
      setSession({ access, refresh });
    }
  }, []);

  const setSession = (newTokens: Tokens | null) => {
    if (newTokens) {
      localStorage.setItem("access", newTokens.access);
      localStorage.setItem("refresh", newTokens.refresh);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newTokens.access}`;
      const payload: any = jwtDecode(newTokens.access);
      setUser({ id: payload.sub, email: payload.email, roles: payload.roles ?? [] });
    } else {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
    }
    setTokens(newTokens);
  };

  const login = useCallback(async (email: string, password: string) => {
    const resp = await axios.post(
      `${import.meta.env.VITE_AUTH_URL}/api/v1/auth/login`,
      { email, password }
    );
    setSession({ access: resp.data.token, refresh: resp.data.refreshToken });
  }, []);

  const register = useCallback(async (data: any) => {
    const resp = await axios.post(
      `${import.meta.env.VITE_AUTH_URL}/api/v1/auth/register`,
      data
    );
    setSession({ access: resp.data.token, refresh: resp.data.refreshToken });
  }, []);

  const logout = useCallback(() => setSession(null), []);

  // Optional token refresh every 5 minutes
  useEffect(() => {
    if (!tokens) return;
    const interval = setInterval(async () => {
      try {
        const resp = await axios.post(
          `${import.meta.env.VITE_AUTH_URL}/api/v1/auth/refresh-token`,
          { refreshToken: tokens.refresh }
        );
        setSession({ access: resp.data.token, refresh: resp.data.refreshToken });
      } catch {
        setSession(null);
      }
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [tokens]);

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
