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
  TextField,
  Collapse
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
  Send as SendIcon,
  ExpandMore as ExpandMoreIcon,
  Reply as ReplyIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import blogService, { Blog, Comment } from '../../services/blogService';
import { useAuth } from '../../context/AuthContext';
import CommentBox from './CommentBox';

const BlogPostDetail: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { username } = useAuth();
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      content: "This is a test comment",
      created_at: new Date().toISOString(),
      author: {
        id: 1,
        username: "TestUser1"
      },
      replies: [
        {
          id: 2,
          content: "This is a reply to the first comment",
          created_at: new Date().toISOString(),
          author: {
            id: 2,
            username: "TestUser2"
          }
        }
      ]
    }
  ]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commentReplying, setCommentReplying] = useState<number | null>(null);

  // Use mock data instead of API call
  useEffect(() => {
    const loadBlogAndComments = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const blogData = await blogService.getBlog(Number(id));
        setBlog(blogData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading blog:', err);
        setError('Failed to load the blog post. Please try again later.');
        setIsLoading(false);
      }
    };

    loadBlogAndComments();
  }, [id]);

  // Mock comment submission
  const handleCommentSubmit = (content: string, parentId?: number) => {
    if (!content.trim()) return;

    const newComment = {
      id: Math.floor(Math.random() * 1000),
      content: content,
      created_at: new Date().toISOString(),
      author: {
        id: 999,
        username: username || "CurrentUser"
      }
    };

    if (parentId) {
      setComments(prevComments => 
        prevComments.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment]
            };
          }
          return comment;
        })
      );
      setCommentReplying(null);
    } else {
      setComments(prevComments => [...prevComments, newComment]);
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
            {blog.author.username[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1">
              {blog.author.username}
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

        <Box sx={{ 
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          p: 3,
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 4px 12px rgba(0,0,0,0.3)'
            : '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          <Typography variant="h6" gutterBottom>
            Comments ({comments.length})
          </Typography>

          <Box sx={{ 
            maxHeight: '800px',
            overflowY: 'auto',
            mt: 3,
            pr: 2,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              borderRadius: '4px',
              '&:hover': {
                background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
              },
            },
          }}>
            {username ? (
              <Box sx={{ mb: 4 }}>
                <CommentBox
                  comments={comments}
                  onSubmitComment={handleCommentSubmit}
                  currentUser={username}
                  replyingTo={commentReplying}
                  onCancelReply={() => setCommentReplying(null)}
                />
              </Box>
            ) : (
              <Alert severity="info" sx={{ mb: 4 }}>
                Please log in to add comments
              </Alert>
            )}

            <Stack spacing={3}>
              {comments.map(comment => (
                <Box key={comment.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255,255,255,0.05)' 
                        : 'rgba(0,0,0,0.02)',
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {comment.author.username[0].toUpperCase()}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {comment.author.username}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Typography variant="body2">{comment.content}</Typography>
                        
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                          {username && (
                            <Button
                              size="small"
                              startIcon={<ReplyIcon />}
                              onClick={() => setCommentReplying(comment.id)}
                              sx={{ textTransform: 'none' }}
                            >
                              Reply
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Paper>

                  {/* Show replies if they exist */}
                  {comment.replies && comment.replies.length > 0 && (
                    <Box sx={{ pl: 6, mt: 2 }}>
                      <Stack spacing={2}>
                        {comment.replies.map(reply => (
                          <Paper
                            key={reply.id}
                            elevation={0}
                            sx={{
                              p: 2,
                              backgroundColor: theme.palette.mode === 'dark' 
                                ? 'rgba(255,255,255,0.03)' 
                                : 'rgba(0,0,0,0.01)',
                              borderRadius: 2,
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                {reply.author.username[0].toUpperCase()}
                              </Avatar>
                              <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                  <Typography variant="subtitle2" fontWeight="bold">
                                    {reply.author.username}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {new Date(reply.created_at).toLocaleDateString()}
                                  </Typography>
                                </Box>
                                <Typography variant="body2">{reply.content}</Typography>
                              </Box>
                            </Box>
                          </Paper>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {/* Show reply box if replying to this comment */}
                  {commentReplying === comment.id && username && (
                    <Box sx={{ pl: 6, mt: 2 }}>
                      <CommentBox
                        comments={comments}
                        onSubmitComment={handleCommentSubmit}
                        currentUser={username}
                        replyingTo={comment.id}
                        onCancelReply={() => setCommentReplying(null)}
                      />
                    </Box>
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default BlogPostDetail;
