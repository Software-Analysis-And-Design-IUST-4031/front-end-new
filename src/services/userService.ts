import api from './api';
import { UserProfile, BackendPainting, LoginResponse } from '../types';

interface LoginResponseData {
  access: string;
  refresh: string;
  message?: string;
}

type UpdateProfileData = Omit<Partial<UserProfile>, 'profile_picture'> & {
  profile_picture?: File;
};

export const userService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponseData>('/user/login/', { username, password });
      console.log('Login response:', response.data);
      
      const { access, refresh } = response.data;
      if (!access || !refresh) {
        throw new Error('Missing access or refresh token in response');
      }
      const tokenParts = access.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }

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
        message: response.data.message || 'Login successful'
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
    const response = await api.get<UserProfile>(`/user/${userId}/detail/`);
    return response.data;
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
    const response = await api.put(`/user/${userId}/updateEditProfile/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateUserFavorites: async (userId: number, data: Partial<UserProfile>) => {
    const response = await api.put(`/user/${userId}/updateFavorites/`, data);
    return response.data;
  },

  getUserPaintings: async (userId: string | number = '1'): Promise<{ paintings: BackendPainting[] }> => {
    const response = await api.get<{ paintings: BackendPainting[] }>(`/painting/user/${userId}/paintings/`);
    return response.data;
  },

  uploadPainting: async (data: FormData): Promise<BackendPainting> => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('No user ID found');
      }

      const formDataEntries = Object.fromEntries(data.entries());
      console.log('Uploading painting with data:', {
        ...formDataEntries,
        image: formDataEntries.image instanceof File ? {
          name: (formDataEntries.image as File).name,
          type: (formDataEntries.image as File).type,
          size: (formDataEntries.image as File).size,
          lastModified: (formDataEntries.image as File).lastModified
        } : formDataEntries.image
      });
      
      const response = await api.post<BackendPainting>(`/painting/user/${userId}/paintings/add/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Upload response details:', {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: {
          contentType: response.headers['content-type'],
          location: response.headers['location']
        }
      });

      if (!response.data) {
        throw new Error('No data received from server');
      }

      return response.data;
    } catch (error) {
      console.error('Error uploading painting:', error);
      throw error;
    }
  },

  likePainting: async (paintingId: number) => {
    const response = await api.post(`/painting/${paintingId}/like/`);
    return response.data;
  },

  getUserLikes: async (userId: number): Promise<number[]> => {
    const response = await api.get<number[]>(`/user/${userId}/detailFavorites/`);
    return response.data;
  },

  async deletePainting(paintingId: string | number): Promise<void> {
    try {
      console.log('Attempting to delete painting:', { paintingId });
      // Using the correct backend endpoint pattern
      await api.delete(`/painting/paintings/${paintingId}/delete/`);
      console.log('Painting deleted successfully');
    } catch (error: any) {
      console.error('Delete error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete painting');
    }
  }
};
