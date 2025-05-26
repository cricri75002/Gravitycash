import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Mock user data
const MOCK_USER = {
  id: '123',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  balance: 5280.42,
  accountNumber: 'FR76 3000 6000 0112 3456 7890 189',
  cardNumber: '**** **** **** 4321',
  currency: 'EUR'
};

interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  accountNumber: string;
  cardNumber: string;
  currency: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in a real app, this would be an API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          setUser(MOCK_USER);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(MOCK_USER));
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}