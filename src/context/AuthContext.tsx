import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { userService } from '../services/userService';
import { UserProfile } from '../types';
interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  userId: number | null;
  userProfile: UserProfile | null;
  login: (token: string, username: string, userId: number) => void;
  logout: () => void;
  updateProfile: (profile: UserProfile) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem('username'));
  const [userId, setUserId] = useState<number | null>(() => {
    const id = localStorage.getItem('userId');
    return id ? parseInt(id) : null;
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated && userId) {
        try {
          const profile = await userService.getUserProfile(userId);
          setUserProfile(profile);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      }
      setIsLoading(false);
    };

    fetchUserProfile();
  }, [isAuthenticated, userId]);
  const login = (token: string, username: string, userId: number) => {
    console.log('AuthContext: Setting login state...');
    // Ensure token has Bearer prefix
    const finalToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    localStorage.setItem('token', finalToken);
    localStorage.setItem('username', username);
    localStorage.setItem('userId', userId.toString());
    
    setIsAuthenticated(true);
    setUsername(username);
    setUserId(userId);
    console.log('AuthContext: Login state set successfully');
  };

  const logout = () => {
    console.log('AuthContext: Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setUsername(null);
    setUserId(null);
    setUserProfile(null);
    console.log('AuthContext: Logout complete');
  };

  const updateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        username, 
        userId: userId, // explicitly expose userId
        userProfile,
        login, 
        logout,
        updateProfile,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
