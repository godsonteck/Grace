"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type UserRole = 'ADMIN' | 'CASHIER' | 'RADIOLOGIST' | 'GUEST';

interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  branchId: string;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedAuth = localStorage.getItem('grace_auth_session');
    if (savedAuth) {
      setUser(JSON.parse(savedAuth));
    }
  }, []);

  const login = (role: UserRole) => {
    const mockUser: User = {
      id: `u-${Date.now()}`,
      name: role === 'ADMIN' ? 'Grace Admin' : role === 'CASHIER' ? 'Lead Cashier' : 'Dr. Radiologist',
      role,
      email: `${role.toLowerCase()}@gracediagnostic.com`,
      branchId: 'achimota-branch'
    };
    setUser(mockUser);
    localStorage.setItem('grace_auth_session', JSON.stringify(mockUser));
    // Set a cookie for the middleware to read
    document.cookie = `grace_auth_session=${JSON.stringify(mockUser)}; path=/; samesite=strict`;

    if (role === 'CASHIER') router.push('/dashboard/pos');
    else router.push('/dashboard/admin');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('grace_auth_session');
    document.cookie = "grace_auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push('/dashboard/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
