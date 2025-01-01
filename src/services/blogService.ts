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
    // Get all blogs and find the one we want
    const response = await api.get<Blog[]>('/blogs/blogs/');
    const blog = response.data.find(b => b.id === id);
    
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
    // Add the ID to identify which blog to update
    formData.append('blog_id', id.toString());
    
    // Use PUT method to indicate this is an update
    const response = await api.put<Blog>('/blogs/blogs/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteBlog: async (id: number): Promise<void> => {
    // Send delete request with the ID in the body
    await api.post('/blogs/blogs/', {
      blog_id: id,
      action: 'delete'
    });
  },

  getComments: async (blogId: number): Promise<Comment[]> => {
    const blog = await blogService.getBlog(blogId);
    return blog.comments || [];
  },

  addComment: async (blogId: number, commentData: CommentCreateData): Promise<Comment> => {
    const response = await api.post<Comment>(`/blogs/blogs/${blogId}/comments/`, commentData);
    return response.data;
  },

  deleteComment: async (blogId: number, commentId: number): Promise<void> => {
    await api.post(`/blogs/blogs/${blogId}/comments/`, {
      comment_id: commentId,
      action: 'delete'
    });
  }
};

export default blogService;
