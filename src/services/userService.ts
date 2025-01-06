import api from './api';
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
  message?: string;
  error?: string;
}

// Add interfaces for the API responses
interface CountriesResponse {
  countries: string[];
}

interface CitiesResponse {
  cities: string[];
}

interface ChatResponse {
  chats: { username: string; user_id: number; chat_id: number }[];
}

interface UserProps {
  id: number;
  name: string;
  chat_id: number;
}

interface MessageProps {
  date: string; // Timestamp of the message
  text: string; // Content of the message
  sender: string; // 'me' or 'another_user'
}

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

  async updateUserProfile(userId: number, data: FormData): Promise<void> {
    try {
      await api.put(`/user/${userId}/updateEditProfile/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
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

  likePainting: async (paintingId: number) => {
    try {
      const response = await api.post<LikeResponse>(`/painting/paintings/${paintingId}/like/`);
      return response.data;
    } catch (err: any) {
      throw err;
    }
  },

  unlikePainting: async (paintingId: number): Promise<LikeResponse> => {
    try {
      const response = await api.post<LikeResponse>(`/painting/paintings/${paintingId}/unlike/`);
      return response.data;
    } catch (err: any) {
      throw err;
    }
  },

  GetlikePainting: async (paintingId: number) => {
    try {
      const response = await api.get<LikeResponse>(`/painting/paintings/${paintingId}/likes/`);
      return (response.data as LikeResponse).likes_count || 0;
    } catch (error) {
      console.error('Error getting painting likes:', error);
      return 0;
    }
  },

  toggleLikePainting: async (paintingId: number, isCurrentlyLiked: boolean): Promise<LikeResponse> => {
    try {
      const response = isCurrentlyLiked 
        ? await userService.unlikePainting(paintingId)
        : await userService.likePainting(paintingId);
      return response;
    } catch (err: any) {
      // If the error is because the painting is already in the desired state,
      // get the current likes count and return it
      if (err.response?.status === 400) {
        const currentLikes = await userService.GetlikePainting(paintingId);
        return { likes_count: currentLikes };
      }
      throw err;
    }
  },

  getUserLikes: async (userId: number): Promise<number[]> => {
    const response = await api.get<number[]>(`/user/${userId}/detailFavorites/`);
    return response.data;
  },

  getUserProfileGallery : async (userId: number) => {
    const response = await fetch(`/user/${userId}/detail/`);
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    return response.json();
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
      const token = localStorage.getItem('token');
      const response = await api.get<string[]>('/country/countries/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format from country API');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  },

  async getCitiesForCountry(country: string): Promise<string[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get<string[]>(`/country/cities/${encodeURIComponent(country)}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format from cities API');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  },
<<<<<<< HEAD

  updateUserPreferences: async (userId: number, preferences: {
    favorite_painter: string;
    favorite_painting: string;
    favorite_painting_style: string;
    favorite_painting_technique: string;
    favorite_painting_to_own: string;
  }) => {
    const token = localStorage.getItem('token');
    const response = await api.put(
      `/user/${userId}/updateFavorites/`,
      preferences,
      {
        headers: {
          'Authorization': token
        }
      }
    );
    return response.data;
  }
=======
  fetchChats: async (): Promise<UserProps[]> => {
    try {
      const response = await api.get<ChatResponse>('/chat/chats/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data.chats.map(chat => ({
        id: chat.user_id,
        name: chat.username,
        chat_id: chat.chat_id,
      }));
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw new Error('Could not fetch chats');
    }
  },


  sendMessage : async (chat_id: number, content: string): Promise<void> => {
    try {
      const response = await api.post(`/chat/chats/${chat_id}/`, { content }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Message sent:', response.data);
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Could not send message');
    }
  },

  fetchMessages: async (chatId: number): Promise<MessageProps[]> => {
    try {
      const response = await api.get<{ sender: string; content: string; timestamp: string ; chat : number}[]>(
        `/chat/messages/${chatId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      console.log('Fetched messages:', response.data);
  
      // Map the API response to match the MessageProps interface
      return response.data.map((message) => ({
        text: message.content,
        sender: message.sender === localStorage.getItem('username') ? 'me' : 'another_user',
        date: message.timestamp,
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new Error('Could not fetch messages');
    }
  },

  startChat: async (participant: string): Promise<void> => {
    try {
      const response = await api.post(
        '/chat/chats/', // API endpoint
        { participant }, // Request body
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token
            'Content-Type': 'application/json', // Set content type
          },
        }
      );
      console.log('Chat started successfully:', response.data);
    } catch (error) {
      console.error('Error starting chat:', error);
      throw new Error('Could not start chat');
    }
  },
>>>>>>> Corrected_Project
};
