import api from './api';

export interface Blog {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author: {
    id: number;
    username: string;
  };
  image?: string;
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  author: {
    id: number;
    username: string;
  };
  parent?: number;
  replies?: Comment[];
}

export interface CommentCreateData {
  content: string;
}

const blogService = {
  getBlogs: async (): Promise<Blog[]> => {
    const response = await api.get<Blog[]>('/blogs/blogs/');
    return response.data;
  },

  getBlog: async (id: number): Promise<Blog> => {
    const response = await api.get<Blog>(`/blogs/blogs/${id}/`);
    return response.data;
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
    const response = await api.get<Comment[]>(`/blogs/blogs/${blogId}/comments/`);
    return response.data;
  },

  addComment: async (blogId: number, commentData: CommentCreateData): Promise<Comment> => {
    const response = await api.post<Comment>(`/blogs/blogs/${blogId}/comments/`, commentData);
    return response.data;
  },

  deleteComment: async (blogId: number, commentId: number): Promise<void> => {
    await api.delete(`/blogs/blogs/${blogId}/comments/${commentId}/`);
  }
};

export default blogService;
