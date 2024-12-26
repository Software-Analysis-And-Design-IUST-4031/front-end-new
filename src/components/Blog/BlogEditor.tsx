import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Tooltip,
  Divider,
  styled,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Image as ImageIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import MUIRichTextEditor from '../RichTextEditor/MUIRichTextEditor';
import { convertFromRaw, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { stateFromHTML } from 'draft-js-import-html';
import blogService from '../../services/blogService';
import Navbar from '../Navbar';

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.mode === 'dark' ? alpha('#fff', 0.1) : alpha('#000', 0.1),
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? alpha('#fff', 0.2) : alpha('#000', 0.2),
  },
  textTransform: 'none',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1, 3),
  transition: theme.transitions.create(['background-color', 'box-shadow']),
}));

const BlogEditor: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editorContent, setEditorContent] = useState('');
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
        
        // Convert HTML to Draft.js content
        const contentState = stateFromHTML(blog.content);
        const rawContent = convertToRaw(contentState);
        setEditorContent(JSON.stringify(rawContent));
        setContent(blog.content);

        if (blog.image) {
          setImagePreview(blog.image);
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleEditorChange = (contentJson: string) => {
    try {
      const contentState = convertFromRaw(JSON.parse(contentJson));
      const contentHTML = draftToHtml(convertToRaw(contentState));
      setContent(contentHTML);
      setEditorContent(contentJson);
    } catch (error) {
      console.error('Error converting editor content:', error);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }

      if (id) {
        await blogService.updateBlog(Number(id), formData);
      } else {
        await blogService.createBlog(formData);
      }

      navigate('/blog');
    } catch (error) {
      console.error('Error saving blog:', error);
      setError('Failed to save blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Paper sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton onClick={() => navigate('/blog')} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1">
              {id ? 'Edit Blog Post' : 'Create New Blog Post'}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title={previewMode ? "Edit" : "Preview"}>
                <IconButton onClick={() => setPreviewMode(!previewMode)}>
                  <PreviewIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Save Draft">
                <IconButton onClick={handleSubmit} disabled={loading}>
                  <SaveIcon />
                </IconButton>
              </Tooltip>
              <StyledButton
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={<SendIcon />}
                sx={{ ml: 1 }}
              >
                {id ? 'Update Post' : 'Publish Post'}
              </StyledButton>
            </Box>
          </Box>

          <Typography variant="h6" gutterBottom>
            Title
          </Typography>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '16px',
              fontSize: '1.1rem',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '4px',
              backgroundColor: 'transparent',
              color: 'inherit',
            }}
          />

          <Typography variant="h6" gutterBottom>
            Image
          </Typography>
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<ImageIcon />}
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {imagePreview && (
              <>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ height: 50, objectFit: 'cover' }}
                />
                <IconButton onClick={handleDeleteImage} color="error">
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Content
          </Typography>
          <Box sx={{ 
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '4px',
            backgroundColor: theme.palette.mode === 'dark' ? alpha('#000', 0.1) : alpha('#fff', 0.9),
            minHeight: '400px'
          }}>
            <MUIRichTextEditor
              value={editorContent}
              onChange={handleEditorChange}
              readOnly={previewMode}
            />
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default BlogEditor;
