import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('aqwq_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading] = useState(false);

  const login = useCallback(async (email: string, _password: string) => {
    // Mock auth - in production, use Lovable Cloud
    const mockUser: User = {
      id: crypto.randomUUID(),
      email,
      name: email.split('@')[0],
      role: email.includes('admin') ? 'admin' : 'user',
    };
    setUser(mockUser);
    localStorage.setItem('aqwq_user', JSON.stringify(mockUser));
    return true;
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string) => {
    const mockUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      role: 'user',
    };
    setUser(mockUser);
    localStorage.setItem('aqwq_user', JSON.stringify(mockUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('aqwq_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
