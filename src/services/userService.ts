import api, { MEDIA_URL } from './api';
import { UserProfile, BackendPainting, LoginResponse } from '../types';
import { countries as mockCountries, getCitiesForCountry as getMockCities } from '../data/locationData';

interface AuthorDetails {
  user_id?: number;
  id?: number;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  profile_picture?: string;
  biography?: string;
}

interface PaintingWithAuthor extends BackendPainting {
  author?: AuthorDetails;
  artist_details?: AuthorDetails;
}

interface LoginResponseData {
  access: string;
  refresh: string;
  message?: string;
}

export interface UpdateProfileData {
  profile_picture?: File | null;
  firstname?: string;
  lastname?: string;
  nickname?: string;
  email?: string;
  phone_number?: string;
  date_of_birth?: string;
  country?: string;
  city?: string;
  is_gallery?: boolean;
  Theme?: string;
  Dark_light_theme?: string;
  favorite_painter?: string;
  favorite_painting?: string;
  favorite_painting_style?: string;
  favorite_painting_technique?: string;
  favorite_painting_to_own?: string;
  biography?: string;
}

interface LikeResponse {
  likes_count: number;
  message: string;
  hasLiked: boolean;
}

// Add interfaces for the API responses
interface CountriesResponse {
  countries: string[];
}

interface CitiesResponse {
  cities: string[];
}

interface UpdateProfileResponse {
  message: string;
  user: UserProfile;
}

interface ChatMessage {
  sender: string;
  content: string;
  timestamp: string;
}

interface ChatParticipant {
  username: string;
  user_id: number;
  chat_id: number;
}

const formatDateForBackend = (date: string | null | undefined): string | null => {
  if (!date) return null;
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().split('T')[0];
  } catch (e) {
    return null;
  }
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
    try {
      const response = await api.get<UserProfile>(`/user/${userId}/detail/`);
      console.log('Fetched user profile:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  async updateUserProfile(userId: number, data: FormData): Promise<void> {
    try {
      // Log the incoming data
      console.log('Updating profile - Raw FormData:', Object.fromEntries(data.entries()));

      // Validate userId
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Format date_of_birth if present
      const dateOfBirth = data.get('date_of_birth');
      if (dateOfBirth) {
        const formattedDate = formatDateForBackend(dateOfBirth.toString());
        if (formattedDate) {
          data.set('date_of_birth', formattedDate);
        } else {
          data.delete('date_of_birth');
        }
      }

      // Log the request URL and headers
      console.log('Making request to:', `/user/${userId}/updateEditProfile/`);
      console.log('Request headers:', {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        Authorization: 'Bearer <token>' // Token will be added by axios interceptor
      });

      const response = await api.put<UpdateProfileResponse>(`/user/${userId}/updateEditProfile/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });

      if (!response.data) {
        throw new Error('No response data received');
      }

      console.log('Profile update response:', response.data);

      // If there's a profile picture in the response, update the cache
      if (response.data.user && response.data.user.profile_picture && typeof response.data.user.profile_picture === 'string') {
        const profilePicUrl = response.data.user.profile_picture.startsWith('http')
          ? response.data.user.profile_picture
          : `${MEDIA_URL}/${response.data.user.profile_picture.replace(/^\//, '')}`;
        localStorage.setItem('lastProfilePicture', profilePicUrl);
      }
    } catch (error: any) {
      console.error('Error updating profile:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });

      // Handle specific error cases
      if (error.response?.status === 401) {
        throw new Error('Please log in again to update your profile.');
      } else if (error.response?.status === 400) {
        const errorDetails = error.response.data?.details || error.response.data?.error;
        throw new Error(errorDetails ? JSON.stringify(errorDetails) : 'Invalid data provided.');
      } else if (error.response?.status === 413) {
        throw new Error('Profile picture is too large. Please choose a smaller image.');
      }

      throw error.response?.data?.error || error.message || 'Failed to update profile';
    }
  },

  updateUserFavorites: async (userId: number, data: Partial<UserProfile>) => {
    const response = await api.put(`/user/${userId}/updateFavorites/`, data);
    return response.data;
  },

  getUserPaintings: async (userId: string | number = '1'): Promise<{ paintings: BackendPainting[] }> => {
    const response = await api.get<{ paintings: BackendPainting[] }>(`/painting/user/${userId}/paintings/`);
    return response.data;
  },

  getUserPaintingsWithAuthor: async (userId: string | number = '1'): Promise<{ paintings: PaintingWithAuthor[] }> => {
    const response = await api.get<{ paintings: BackendPainting[] }>(`/painting/user/${userId}/paintings/`);
    const paintingsWithAuthor = await Promise.all(
      response.data.paintings.map(async (painting) => {
        try {
          const authorResponse = await api.get<PaintingWithAuthor>(`/painting/${painting.painting_id}/with-author/`);
          return authorResponse.data;
        } catch (error) {
          console.error(`Error fetching author for painting ${painting.painting_id}:`, error);
          return painting as PaintingWithAuthor;
        }
      })
    );
    return { paintings: paintingsWithAuthor };
  },

  uploadPainting: async (data: FormData): Promise<BackendPainting> => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('No user ID found');
      }

      // Log FormData contents for debugging
      const formDataEntries = Object.fromEntries(data.entries());
      console.log('Uploading painting with data:', {
        ...formDataEntries,
        image: formDataEntries.image instanceof File ? {
          name: (formDataEntries.image as File).name,
          type: (formDataEntries.image as File).type,
          size: (formDataEntries.image as File).size
        } : formDataEntries.image
      });

      const response = await api.post<BackendPainting>(
        `/painting/user/${userId}/paintings/add/`, 
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response.data) {
        throw new Error('No data received from server');
      }

      return response.data;
    } catch (error: any) {
      console.error('Error uploading painting:', {
        error,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error.response?.data?.error || error.message || 'Failed to upload painting';
    }
  },

  likePainting: async (paintingId: number): Promise<LikeResponse> => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        throw new Error('Please log in to like paintings');
      }

      // First check if already liked
      const isLiked = await userService.checkUserLikedPainting(parseInt(userId), paintingId);
      if (isLiked) {
        const likesCount = await userService.GetlikePainting(paintingId);
        return {
          likes_count: likesCount,
          message: "Already liked",
          hasLiked: true
        };
      }

      // Like the painting
      await api.post(`/painting/paintings/${paintingId}/like/`, {});
      
      // Get updated like count
      const likesCount = await userService.GetlikePainting(paintingId);

      return {
        likes_count: likesCount,
        message: "Liked successfully",
        hasLiked: true
      };
    } catch (error) {
      console.error('Error liking painting:', error);
      throw error;
    }
  },

  unlikePainting: async (paintingId: number): Promise<LikeResponse> => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        throw new Error('Please log in to unlike paintings');
      }

      // First check if already unliked
      const isLiked = await userService.checkUserLikedPainting(parseInt(userId), paintingId);
      if (!isLiked) {
        const likesCount = await userService.GetlikePainting(paintingId);
        return {
          likes_count: likesCount,
          message: "Already unliked",
          hasLiked: false
        };
      }

      // Unlike the painting
      await api.post(`/painting/paintings/${paintingId}/Unlike/`, {});
      
      // Get updated like count
      const likesCount = await userService.GetlikePainting(paintingId);

      return {
        likes_count: likesCount,
        message: "Unliked successfully",
        hasLiked: false
      };
    } catch (error) {
      console.error('Error unliking painting:', error);
      throw error;
    }
  },

  toggleLikePainting: async (paintingId: number): Promise<LikeResponse> => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        throw new Error('Please log in to like/unlike paintings');
      }

      // Get current like status
      const isLiked = await userService.checkUserLikedPainting(parseInt(userId), paintingId);
      
      // Call appropriate function based on current status
      if (isLiked) {
        return await userService.unlikePainting(paintingId);
      } else {
        return await userService.likePainting(paintingId);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },

  GetlikePainting: async (paintingId: number): Promise<number> => {
    try {
      const response = await api.get<{ painting_id: number, likes_count: number }>(
        `/painting/paintings/${paintingId}/likes/`
      );
      return response.data.likes_count;
    } catch (error) {
      console.error('Error getting likes count:', error);
      return 0;
    }
  },

  checkUserLikedPainting: async (userId: number, paintingId: number): Promise<boolean> => {
    try {
      const response = await api.get<{ liked: boolean }>(
        `/painting/user/${userId}/paintings/${paintingId}/liked/`
      );
      return response.data.liked;
    } catch (error) {
      console.error('Error checking like status:', error);
      return false;
    }
  },

  getUserLikes: async (userId: number): Promise<number[]> => {
    const response = await api.get<number[]>(`/user/${userId}/detailFavorites/`);
    return response.data;
  },

  async deletePainting(paintingId: string | number): Promise<void> {
    try {
      console.log('Attempting to delete painting:', { paintingId });
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }

      const response = await api.delete(`/painting/user/${userId}/paintings/delete/${paintingId}/`);
      
      if (response.status !== 204 && response.status !== 200) {
        throw new Error('Failed to delete painting. Please try again.');
      }
    } catch (error: any) {
      console.error('Delete error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Handle specific error cases
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to delete this painting.');
      } else if (error.response?.status === 404) {
        throw new Error('Painting not found. It may have been already deleted.');
      } else if (error.response?.status === 401) {
        throw new Error('Please log in again to delete this painting.');
      }
      
      throw error.response?.data?.error || error.message || 'Failed to delete painting. Please try again.';
    }
  },

  async getCountries(): Promise<string[]> {
    try {
      // Try to get countries from backend
      const response = await api.get<any>('/country/countries/');
      const backendCountries = Array.isArray(response.data) ? response.data : [];
      
      // If backend returns no data, use mock data
      if (backendCountries.length === 0) {
        console.log('Using mock country data');
        return mockCountries.map(c => c.label);
      }
      
      return backendCountries;
    } catch (error) {
      console.error('Error fetching countries:', error);
      // Fallback to mock data on error
      console.log('Using mock country data due to error');
      return mockCountries.map(c => c.label);
    }
  },

  async getCitiesForCountry(country: string): Promise<string[]> {
    try {
      // Try to get cities from backend
      const response = await api.get<any>(`/country/cities/${encodeURIComponent(country)}/`);
      const backendCities = Array.isArray(response.data) ? response.data : [];
      
      // If backend returns no data, use mock data
      if (backendCities.length === 0) {
        console.log('Using mock city data');
        return getMockCities(country);
      }
      
      return backendCities;
    } catch (error) {
      console.error('Error fetching cities:', error);
      // Fallback to mock data on error
      console.log('Using mock city data due to error');
      return getMockCities(country);
    }
  },

  fetchChats: async (): Promise<ChatParticipant[]> => {
    try {
      const response = await api.get('/chat/chats/');
      return response.data.chats;
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  },

  fetchMessages: async (chatId: number): Promise<ChatMessage[]> => {
    try {
      const response = await api.get(`/chat/messages/${chatId}/`);
      return response.data.map((msg: any) => ({
        text: msg.content,
        sender: msg.sender === localStorage.getItem('username') ? 'me' : 'another_user',
        date: msg.timestamp
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  sendMessage: async (chatId: number, content: string): Promise<void> => {
    try {
      await api.post(`/chat/messages/${chatId}/`, { content });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  createChat: async (participantUsername: string): Promise<any> => {
    try {
      const response = await api.post('/chat/chats/', { participant: participantUsername });
      return response.data;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  },
};
