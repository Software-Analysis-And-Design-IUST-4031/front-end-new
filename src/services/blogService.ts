import api from './api';

export interface Blog {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
  author_name: string;
  image?: string;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  author_name: string;
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
    const blog = await blogService.getBlog(blogId);
    return blog.comments || [];
  },

  addComment: async (blogId: number, commentData: CommentCreateData): Promise<Comment> => {
    try {
      const response = await api.post<Comment>(`/blogs/blogs/${blogId}/comments/`, {
        content: commentData.content,
        parent: commentData.parent || null,
        blog: blogId
      });
      
      // Ensure we have all the required fields
      if (!response.data.author_name || !response.data.created_at) {
        throw new Error('Invalid comment data structure');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  deleteComment: async (blogId: number, commentId: number): Promise<void> => {
    await api.delete(`/blogs/blogs/${blogId}/comments/${commentId}/delete/`);
  }
};

export default blogService;
