
import * as React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  role: 'stock' | 'biller';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'stock' | 'biller') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock credentials
  const mockCredentials = {
    stock: {
      email: 'stock@gmail.com',
      password: 'Pass@123'
    },
    biller: {
      email: 'biller@gmail.com',
      password: 'Pass@123'
    }
  };

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('auth-user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      
      // Redirect based on role
      if (userData.role === 'biller' && !window.location.pathname.startsWith('/biller')) {
        window.location.href = '/biller';
      } else if (userData.role === 'stock' && window.location.pathname.startsWith('/biller')) {
        window.location.href = '/';
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'stock' | 'biller'): Promise<boolean> => {
    const validCredentials = mockCredentials[role];
    
    if (email === validCredentials.email && password === validCredentials.password) {
      const userData = { email, role };
      setUser(userData);
      localStorage.setItem('auth-user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
