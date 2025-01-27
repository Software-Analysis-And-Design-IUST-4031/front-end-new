import React, { useState, useCallback, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Avatar, 
  Button, 
  IconButton, 
  Paper,
  Divider,
  useTheme,
  Stack,
  Badge,
  Chip,
  Alert,
  Snackbar,
  Modal,
  CircularProgress,
  TextField
} from '@mui/material';
import { 
  ArrowUpward,
  ArrowDownward,
  Share, 
  ArrowBack,
  ErrorOutline,
  ZoomIn,
  ZoomOut,
  Close,
  Send as SendIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import blogService, { Blog, Comment, CommentCreateData } from '../../services/blogService';
import { useAuth } from '../../context/AuthContext';
import CommentBox from './CommentBox';

const BlogPostDetail: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { username } = useAuth();
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBlogAndComments = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const blogData = await blogService.getBlog(Number(id));
        const commentsData = await blogService.getComments(Number(id));
        setBlog(blogData);
        setComments(commentsData);
      } catch (err) {
        console.error('Error loading blog:', err);
        setError('Failed to load the blog post. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogAndComments();
  }, [id]);

  const handleCommentSubmit = async (commentData: CommentCreateData) => {
    if (!id || !commentData.content.trim()) return;

    try {
      const newComment = await blogService.addComment(Number(id), commentData);
      // Add the new comment to the existing comments
      setComments(prevComments => [...prevComments, newComment]);
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !blog) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || 'Blog post not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/blog')}
        sx={{ mb: 4 }}
      >
        Back to Blogs
      </Button>

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          {blog.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ mr: 2 }}>
            {blog.author_name[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1">
              {blog.author_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(blog.created_at)}
            </Typography>
          </Box>
        </Box>

        {blog.image && (
          <Box sx={{ my: 3 }}>
            <img
              src={blog.image}
              alt={blog.title}
              style={{ 
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 8
              }}
            />
          </Box>
        )}

        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {blog.content}
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom>
          Comments ({comments.length})
        </Typography>

        <Box sx={{ mt: 4 }}>
          <CommentBox
            blogId={Number(id)}
            comments={comments}
            onCommentSubmit={handleCommentSubmit}
          />
        </Box>

        <Stack spacing={2}>
          {comments.map((comment) => (
            <Paper key={comment.id} sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ mr: 2 }}>
                  {comment.author_name[0].toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2">
                    {comment.author_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(comment.created_at)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2">
                {comment.content}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Paper>
    </Container>
  );
};

export default BlogPostDetail;
