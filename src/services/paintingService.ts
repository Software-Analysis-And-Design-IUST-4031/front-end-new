import api from './api';
import { Painting } from '../types';

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
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('User not logged in');

      console.log('Attempting to save painting:', { userId, paintingId });
      const response = await api.post(`/api/api/painting/save/${userId}/${paintingId}/`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Save response:', response);
    } catch (error) {
      console.error('Error saving painting:', {
        error,
        config: (error as any)?.config,
        url: (error as any)?.config?.url,
        status: (error as any)?.response?.status,
        data: (error as any)?.response?.data
      });
      throw new Error('Failed to save painting');
    }
  },

  unsavePainting: async (paintingId: number): Promise<void> => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('User not logged in');

      await api.delete(`/api/api/painting/save/${userId}/${paintingId}/`);
    } catch (error) {
      console.error('Error unsaving painting:', error);
      throw new Error('Failed to unsave painting');
    }
  },

  getSavedPaintings: async (): Promise<number[]> => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('User not logged in');

      const response = await api.get<number[]>(`/api/api/painting/saved/${userId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching saved paintings:', error);
      return [];
    }
  },

  checkIfPaintingSaved: async (paintingId: number): Promise<boolean> => {
    try {
      const savedPaintings = await paintingService.getSavedPaintings();
      return savedPaintings.includes(paintingId);
    } catch (error) {
      console.error('Error checking if painting is saved:', error);
      return false;
    }
  },

  getPaintingLikes: async (paintingId: number): Promise<number> => {
    const response = await api.get<{ likes: number }>(`/painting/paintings/${paintingId}/likes/`);
    return response.data.likes;
  },

  checkIfLiked: async (userId: number, paintingId: number): Promise<boolean> => {
    try {
      const response = await api.get<{ liked: boolean }>(`/painting/user/${userId}/paintings/${paintingId}/liked/`);
      return response.data.liked;
    } catch {
      return false;
    }
  }
};

export default paintingService; 