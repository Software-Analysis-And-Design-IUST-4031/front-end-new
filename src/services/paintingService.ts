import api from './api';
import { Painting } from '../types/painting';

const paintingService = {
  getPaintings: async (): Promise<Painting[]> => {
    const response = await api.get<Painting[]>('/painting/paintings/');
    return response.data;
  },

  getPaintingById: async (id: number): Promise<Painting> => {
    const response = await api.get<Painting>(`/painting/${id}/with-author/`);
    return response.data;
  },

  getUserPaintings: async (userId: number): Promise<Painting[]> => {
    const response = await api.get<Painting[]>(`/painting/user/${userId}/paintings/`);
    return response.data;
  },

  likePainting: async (paintingId: number): Promise<void> => {
    await api.post(`/painting/paintings/${paintingId}/like/`);
  },

  unlikePainting: async (paintingId: number): Promise<void> => {
    await api.post(`/painting/paintings/${paintingId}/Unlike/`);
  },

  savePainting: async (paintingId: number): Promise<void> => {
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('User not logged in');
    await api.post(`/painting/save/${userId}/${paintingId}/`);
  },

  unsavePainting: async (paintingId: number): Promise<void> => {
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('User not logged in');
    await api.delete(`/painting/unsave/${userId}/${paintingId}/`);
  },

  getSavedPaintings: async (profileUserId?: number): Promise<Painting[]> => {
    try {
      const userId = profileUserId || Number(localStorage.getItem('userId'));
      const token = localStorage.getItem('token');
      
      console.log('Fetching saved paintings:', {
        userId,
        hasToken: !!token,
        tokenType: typeof token,
        tokenLength: token?.length,
        tokenStart: token?.substring(0, 20) + '...',
      });

      if (!userId) throw new Error('User not logged in');
      
      console.log('Making request to:', `/painting/saved/${userId}/`);
      const response = await api.get<any[]>(`/painting/saved/${userId}/`);
      
      console.log('Raw saved paintings response:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data
      });
      
      if (!Array.isArray(response.data)) {
        console.log('Response data is not an array:', response.data);
        return [];
      }

      return response.data.map((painting: any) => {
        console.log('Processing painting:', painting);
        return {
          id: String(painting.painting__id || painting.id),
          imageUrl: painting.painting__image?.startsWith('http') 
            ? painting.painting__image 
            : `${api.defaults.baseURL}${painting.painting__image}`,
          title: painting.painting__title || '',
          description: '', // These fields are not provided by backend for saved paintings
          price: '0',
          style: '',
          material: '',
          horizontalDepth: '',
          verticalDepth: '',
          likes: 0,
          isLiked: false,
          isSaved: true,
          createdAt: new Date().toISOString(),
          author: {
            id: '0',
            username: '',
            name: '',
            avatarUrl: ''
          }
        };
      });
    } catch (error: any) {
      console.error('Error fetching saved paintings:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: {
            ...error.config?.headers,
            Authorization: error.config?.headers?.Authorization 
              ? 'Bearer [REDACTED]' 
              : undefined
          }
        }
      });
      return [];
    }
  },

  checkIfPaintingSaved: async (paintingId: number): Promise<boolean> => {
    try {
      const savedPaintings = await paintingService.getSavedPaintings();
      return savedPaintings.some(painting => String(painting.id) === String(paintingId));
    } catch (error) {
      console.error('Error checking if painting is saved:', error);
      return false;
    }
  },

  getPaintingLikes: async (paintingId: number): Promise<number> => {
    const response = await api.get(`/painting/paintings/${paintingId}/likes/`);
    return response.data.likes;
  },

  checkIfLiked: async (userId: number, paintingId: number): Promise<boolean> => {
    try {
      const response = await api.get(`/painting/user/${userId}/paintings/${paintingId}/liked/`);
      return response.data.liked;
    } catch {
      return false;
    }
  }
};

export default paintingService; 