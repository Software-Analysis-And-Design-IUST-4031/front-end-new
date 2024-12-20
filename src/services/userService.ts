import api from './api';
import { UserProfile, BackendPainting, LoginResponse } from '../types';

type UpdateProfileData = Omit<Partial<UserProfile>, 'profile_picture'> & {
  profile_picture?: File;
};

export const userService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await api.post('/user/login/', { username, password });
      console.log('Login response:', response.data);
      
      const { access, refresh, message } = response.data;
      if (!access || !refresh) {
        throw new Error('Missing access or refresh token in response');
      }

      // Decode the JWT token to get user_id
      const tokenParts = access.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }

      // Decode the payload (second part of the token)
      const payload = JSON.parse(atob(tokenParts[1]));
      console.log('Decoded token payload:', payload);

      const user_id = payload.user_id;
      if (!user_id) {
        throw new Error('No user_id found in token payload');
      }

      return {
        access,
        refresh,
        user_id: Number(user_id),
        username,
        message
      };
    } catch (error: any) {
      console.error('Login error details:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  getUserProfile: async (userId: number): Promise<UserProfile> => {
    try {
      const response = await api.get(`/user/${userId}/detail/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  updateUserProfile: async (userId: number, data: UpdateProfileData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'profile_picture' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    const response = await api.patch(`/user/${userId}/updateEditProfile/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateUserFavorites: async (userId: number, data: Partial<UserProfile>) => {
    const response = await api.patch(`/user/${userId}/updateFavorites/`, data);
    return response.data;
  },

  getUserPaintings: async (userId: string | number = '1'): Promise<{ paintings: BackendPainting[] }> => {
    try {
      const response = await api.get(`/painting/user/${userId}/paintings/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user paintings:', error);
      throw error;
    }
  },

  uploadPainting: async (data: FormData): Promise<BackendPainting> => {
    const response = await api.post('/painting/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  likePainting: async (paintingId: number) => {
    const response = await api.post(`/painting/${paintingId}/like/`);
    return response.data;
  },

  getUserLikes: async (userId: number): Promise<number[]> => {
    try {
      const response = await api.get(`/user/${userId}/detailFavorites/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user likes:', error);
      return [];
    }
  }
};
