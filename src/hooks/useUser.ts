import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { UserProfile } from '../types';

const defaultUser: UserProfile = {
  id: '1',
  fullName: 'John Doe',
  username: '@johndoe',
  avatarUrl: 'https://via.placeholder.com/150',
  description: 'Digital artist and creator',
  location: 'San Francisco, CA',
  followers: 1234,
  following: 567,
  socialLinks: {
    twitter: 'https://twitter.com/johndoe',
  },
  bio: 'Creating digital art and exploring new frontiers in design.'
};

export function useUser() {
  const [user, setUser] = useLocalStorage<UserProfile>('user', defaultUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFollow = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setUser(prev => ({
        ...prev,
        followers: prev.followers + 1
      }));
    } catch (error) {
      setError('Failed to update followers');
      console.error('Error updating followers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const handleMessage = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      setError('Failed to send message');
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAvatarChange = useCallback(async (newAvatarUrl: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setUser(prev => ({
        ...prev,
        avatarUrl: newAvatarUrl
      }));
    } catch (error) {
      setError('Failed to update avatar');
      console.error('Error updating avatar:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      setIsLoading(true);
      setError(null);
      setUser(prev => ({
        ...prev,
        ...updates
      }));
    } catch (error) {
      setError('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  return {
    user,
    isLoading,
    error,
    handleFollow,
    handleMessage,
    handleAvatarChange,
    updateProfile
  };
}
