import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Image as ImageIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material';
import blogService from '../../services/blogService';
import Navbar from '../Navbar';

const BlogEditor: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const blog = await blogService.getBlog(Number(id));
        setTitle(blog.title);
        setContent(blog.content);
        if (blog.image) {
          setImagePreview(blog.image);
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('content', content.trim());
      if (image) {
        formData.append('image', image);
      }

      if (id) {
        await blogService.updateBlog(Number(id), formData);
      } else {
        await blogService.createBlog(formData);
      }

      navigate('/blog');
    } catch (err) {
      console.error('Error saving blog:', err);
      setError('Failed to save blog post. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (window.confirm('Are you sure you want to leave? Any unsaved changes will be lost.')) {
      navigate('/blog');
    }
  };

  if (loading && !title && !content) {
    return (
      <>
        <Navbar />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 64px)">
          <CircularProgress size={40} />
        </Box>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box 
        sx={{ 
          background: theme.palette.mode === 'dark' 
            ? `linear-gradient(to bottom, ${alpha(theme.palette.common.black, 0.3)}, transparent)`
            : `linear-gradient(to bottom, ${alpha(theme.palette.common.black, 0.03)}, transparent)`,
          pt: 6,
          pb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={() => navigate('/blog')}
              sx={{
                bgcolor: theme.palette.mode === 'dark' 
                  ? alpha(theme.palette.common.white, 0.05)
                  : alpha(theme.palette.common.black, 0.02),
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.common.white, 0.1)
                    : alpha(theme.palette.common.black, 0.05),
                  transform: 'translateX(-2px)',
                },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ 
                fontWeight: 800,
                letterSpacing: -1,
                color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
              }}
            >
              {id ? 'Edit Post' : 'Create New Post'}
            </Typography>
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <Button
                startIcon={<PreviewIcon />}
                onClick={() => setPreviewMode(!previewMode)}
                sx={{
                  borderRadius: '20px',
                  px: 3,
                  bgcolor: theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.common.white, 0.05)
                    : alpha(theme.palette.common.black, 0.02),
                  color: theme.palette.mode === 'dark' 
                    ? theme.palette.common.white 
                    : theme.palette.common.black,
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' 
                      ? alpha(theme.palette.common.white, 0.1)
                      : alpha(theme.palette.common.black, 0.05),
                  },
                }}
              >
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
              <Button
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                disabled={!title.trim() || !content.trim()}
                sx={{
                  borderRadius: '20px',
                  px: 3,
                  bgcolor: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
                  color: theme.palette.mode === 'dark' ? theme.palette.common.black : theme.palette.common.white,
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' 
                      ? alpha(theme.palette.common.white, 0.9)
                      : alpha(theme.palette.common.black, 0.8),
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease-in-out',
                  '&.Mui-disabled': {
                    bgcolor: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.common.white, 0.1)
                      : alpha(theme.palette.common.black, 0.1),
                  },
                }}
              >
                Save Post
              </Button>
            </Box>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 4,
                borderRadius: 2,
              }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          <Paper 
            elevation={0}
            sx={{ 
              p: 4,
              borderRadius: '28px',
              backgroundColor: theme.palette.mode === 'dark'
                ? alpha(theme.palette.common.white, 0.05)
                : alpha(theme.palette.common.black, 0.02),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${
                theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.white, 0.1)
                  : alpha(theme.palette.common.black, 0.05)
              }`,
            }}
          >
            {previewMode ? (
              <Box>
                <Typography 
                  variant="h3" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 800,
                    color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
                  }}
                >
                  {title || 'Untitled Post'}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.8,
                    color: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.common.white, 0.9)
                      : alpha(theme.palette.common.black, 0.9),
                  }}
                >
                  {content || 'No content yet...'}
                </Typography>
              </Box>
            ) : (
              <Box>
                <TextField
                  fullWidth
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px',
                      backgroundColor: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.common.white, 0.05)
                        : alpha(theme.palette.common.black, 0.02),
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.common.white, 0.08)
                          : alpha(theme.palette.common.black, 0.04),
                      },
                      '& fieldset': {
                        borderColor: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.common.white, 0.1)
                          : alpha(theme.palette.common.black, 0.1),
                      },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={12}
                  label="Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px',
                      backgroundColor: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.common.white, 0.05)
                        : alpha(theme.palette.common.black, 0.02),
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.common.white, 0.08)
                          : alpha(theme.palette.common.black, 0.04),
                      },
                      '& fieldset': {
                        borderColor: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.common.white, 0.1)
                          : alpha(theme.palette.common.black, 0.1),
                      },
                    },
                  }}
                />
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default BlogEditor;
