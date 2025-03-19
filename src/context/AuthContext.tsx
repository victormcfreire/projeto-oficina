
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User, AuthState, LoginCredentials, RegisterData } from '../models/auth';

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123', // In a real app, this would be hashed
    role: 'admin'
  },
  {
    id: '2',
    username: 'user',
    email: 'user@example.com',
    password: 'password123', // In a real app, this would be hashed
    role: 'user'
  }
];

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null
  });

  // Check for existing auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setState({
        isAuthenticated: true,
        user: JSON.parse(storedUser),
        loading: false,
        error: null
      });
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Mock token generation - in a real app, you'd use a proper JWT library
  const generateToken = (user: User): string => {
    return btoa(JSON.stringify({ userId: user.id, timestamp: new Date().getTime() }));
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // In a real app, this would be an API call
      const user = mockUsers.find(
        u => u.email === credentials.email && u.password === credentials.password
      );
      
      if (!user) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Credenciais inválidas'
        }));
        return false;
      }
      
      const token = generateToken(user);
      
      // Store auth data in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      setState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null
      });
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Falha ao fazer login'
      }));
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === data.email);
      
      if (existingUser) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Já existe um usuário com esse e-mail'
        }));
        return false;
      }
      
      // Create new user
      const newUser: User = {
        id: uuidv4(),
        username: data.username,
        email: data.email,
        password: data.password, // In a real app, this would be hashed
        role: 'user'
      };
      
      // In a real app, you would save this to a database
      mockUsers.push(newUser);
      
      // Auto-login after registration
      const token = generateToken(newUser);
      
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', token);
      
      setState({
        isAuthenticated: true,
        user: newUser,
        loading: false,
        error: null
      });
      
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Falha ao registrar usuário'
      }));
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    setState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
