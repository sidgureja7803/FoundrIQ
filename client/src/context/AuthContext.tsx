import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { appwriteAuth } from '../services/appwrite';

// Define user type
interface User {
  $id: string;
  name: string;
  email: string;
  prefs?: {
    // Any user preferences can be added here
    darkMode?: boolean;
    termsAccepted?: boolean;
  };
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Use ref to track if we've already checked auth to prevent repeated calls
  const hasCheckedAuth = useRef(false);
  const authCheckInProgress = useRef(false);

  // Clear error
  const clearError = () => setError(null);

  // Check if user is logged in - ONLY ONCE on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Prevent multiple simultaneous checks
      if (authCheckInProgress.current || hasCheckedAuth.current) {
        console.log('⏭️  Auth check skipped - already checked or in progress');
        return;
      }

      try {
        authCheckInProgress.current = true;
        setIsLoading(true);
        console.log('🔍 Checking authentication status (ONE TIME)...');
        const currentUser = await appwriteAuth.getCurrentUser();

        if (currentUser) {
          console.log('✅ User is authenticated:', currentUser.email);
          setUser(currentUser as User);
          setIsAuthenticated(true);
        } else {
          console.log('❌ No user session found');
          setUser(null);
          setIsAuthenticated(false);
        }

        hasCheckedAuth.current = true;
      } catch (err) {
        console.error('❌ Authentication check failed:', err);
        setUser(null);
        setIsAuthenticated(false);
        hasCheckedAuth.current = true;
      } finally {
        setIsLoading(false);
        authCheckInProgress.current = false;
      }
    };

    // Check auth ONLY ONCE on mount
    checkAuth();

    // NO interval polling
    // NO visibility change listeners
    // This prevents the constant API calls that were breaking the flow
  }, []); // Empty dependency array = run only once

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      clearError();

      console.log('🔐 Attempting login for:', email);
      await appwriteAuth.login(email, password);

      console.log('✅ Login successful, fetching user data...');

      // Small delay to ensure session is fully established
      await new Promise(resolve => setTimeout(resolve, 100));

      const currentUser = await appwriteAuth.getCurrentUser();

      if (currentUser) {
        console.log('✅ User authenticated:', currentUser.email);
        setUser(currentUser as User);
        setIsAuthenticated(true);
        hasCheckedAuth.current = true;

        navigate('/my-ideas');
      } else {
        console.error('❌ Login succeeded but could not fetch user');
        setError('Login succeeded but could not load user data. Please refresh the page.');
      }
    } catch (err: any) {
      console.error('❌ Login failed:', err);

      // Better error messages
      let errorMessage = 'Login failed. Please try again.';

      if (err.code === 401) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (err.code === 429) {
        errorMessage = 'Too many attempts. Please wait a few minutes and try again.';
      } else if (err.message?.includes('Project with the requested ID')) {
        errorMessage = 'Configuration error. Please contact support.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setIsAuthenticated(false);
      throw err; // Re-throw so SignInPage can catch it
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      clearError();

      console.log('📝 Creating account for:', email);
      await appwriteAuth.createAccount(email, password, name);

      // Small delay to ensure session is fully established
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('✅ Account created, fetching user data...');
      const currentUser = await appwriteAuth.getCurrentUser();

      if (currentUser) {
        console.log('✅ User registered and authenticated:', currentUser.email);
        setUser(currentUser as User);
        setIsAuthenticated(true);
        hasCheckedAuth.current = true;
        navigate('/my-ideas');
      }
    } catch (err: any) {
      console.error('❌ Registration failed:', err);
      setError(err?.message || 'Registration failed. Please try again.');
      setIsAuthenticated(false);
      throw err; // Re-throw for SignUpPage to handle
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      await appwriteAuth.logout();
      setUser(null);
      setIsAuthenticated(false);
      hasCheckedAuth.current = false; // Reset so auth can be checked again after re-login
      navigate('/');
    } catch (err: any) {
      console.error('Logout failed:', err);
      setError(err?.message || 'Logout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
