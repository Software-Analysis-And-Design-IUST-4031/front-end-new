import api from './api';

export interface Blog {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
  author_name: string;
  author: {
    username: string;
  };
  image?: string;
  comments?: Comment[];
  tags: string[];
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  author_name: string;
  author: {
    username: string;
  };
  blog: number;
  parent?: number | null;
  replies?: Comment[];
}

export interface CommentCreateData {
  content: string;
  parent?: number | null;
}

const blogService = {
  getBlogs: async (): Promise<Blog[]> => {
    const response = await api.get<Blog[]>('/blogs/blogs/');
    return response.data;
  },

  getBlog: async (id: number): Promise<Blog> => {
    const response = await api.get<Blog>(`/blogs/blogs/${id}/`);
    const blog = response.data;
    
    if (!blog) {
      throw new Error('Blog not found');
    }

    if (!blog.author_name) {
      console.error('Blog data is missing author name:', blog);
      throw new Error('Invalid blog data structure');
    }

    return blog;
  },

  createBlog: async (formData: FormData): Promise<Blog> => {
    const response = await api.post<Blog>('/blogs/blogs/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateBlog: async (id: number, formData: FormData): Promise<Blog> => {
    const response = await api.put<Blog>(`/blogs/blogs/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteBlog: async (id: number): Promise<void> => {
    await api.delete(`/blogs/blogs/${id}/`);
  },

  getComments: async (blogId: number): Promise<Comment[]> => {
    try {
      const response = await api.get<Comment[]>(`/blogs/blogs/${blogId}/comments/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },

  addComment: async (blogId: number, commentData: CommentCreateData): Promise<Comment> => {
    try {
      console.log('Sending comment data:', {
        content: commentData.content,
        blog: blogId,
        parent: commentData.parent || null
      });

      const response = await api.post<Comment>(`/blogs/blogs/${blogId}/comments/`, {
        content: commentData.content,
        blog: blogId,
        parent: commentData.parent || null
      });
      
      if (!response.data) {
        throw new Error('No response data received');
      }

      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  deleteComment: async (blogId: number, commentId: number): Promise<void> => {
    try {
      await api.delete(`/blogs/blogs/${blogId}/comments/${commentId}/`);
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
};

export default blogService;
