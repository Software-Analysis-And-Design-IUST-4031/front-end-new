import api from './api';
import { UserProfile, BackendPainting, LoginResponse } from '../types';

type UpdateProfileData = Omit<Partial<UserProfile>, 'profile_picture'> & {
  profile_picture?: File;
};

type LikeResponse = {
  painting_id: number;
  like_count : number; 
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
      console.log('Fetching paintings for user:', userId);
      const response = await api.get(`/painting/user/${userId}/paintings/`);
      console.log('Paintings response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user paintings:', error);
      throw error;
    }
  },

  uploadPainting: async (data: FormData): Promise<BackendPainting> => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }

      console.log('Attempting to upload painting for user:', userId);
      const response = await api.post(`/painting/user/${userId}/paintings/add/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload successful:', response.data);
      
      // Handle different response formats
      if (response.data.painting) {
        return response.data.painting;
      } else if (response.data.id || response.data.painting_id) {
        // If the painting is returned directly
        return response.data;
      }
      
      throw new Error('Invalid response format from server');
    } catch (error: any) {
      console.error('Upload error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to upload painting');
    }
  },

  likePainting: async (paintingId: number) => {
    const response = await api.post(`/painting/${paintingId}/like/`);
    return response.data;
  },

  // GetlikePainting: async (paintingId: number) : Promise<number>=> {
  //   const response : any = api.get<LikeResponse>(`/painting/${paintingId}/likes/`);
  //   const like_count : number = response.data.like_count;
  //   return like_count ;
  // },



  getUserLikes: async (userId: number): Promise<number[]> => {
    try {
      const response = await api.get(`/user/${userId}/detailFavorites/`);
      // Ensure we always return an array of numbers
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && typeof response.data === 'object') {
        // If the response is an object with a likes property
        return Array.isArray(response.data.likes) ? response.data.likes : [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching user likes:', error);
      return [];
    }
  },


  // GetlikePainting : async (painting_id : number) 

  deletePainting: async (paintingId: string | number): Promise<void> => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }

      console.log('Attempting to delete painting:', { userId, paintingId });
      // Updated to match the new backend endpoint
      await api.delete(`/painting/${paintingId}/delete/`);
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
