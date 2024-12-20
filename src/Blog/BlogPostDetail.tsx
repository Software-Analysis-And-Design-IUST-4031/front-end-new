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
  CircularProgress
} from '@mui/material';
import { 
  ArrowUpward,
  ArrowDownward,
  Share, 
  ArrowBack,
  ErrorOutline,
  ZoomIn,
  ZoomOut,
  Close
} from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor as DraftEditor } from 'draft-js';
import 'draft-js/dist/Draft.css';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  date: string;
  upvotes: number;
  downvotes: number;
  userVoted?: 'up' | 'down' | null;
}

const BlogPostDetail: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const post = location.state?.post;
  const [comment, setComment] = useState<EditorState>(EditorState.createEmpty());
  const [comments, setComments] = useState<Comment[]>([]);
  const [upvotes, setUpvotes] = useState<number>(post?.votes || 0);
  const [downvotes, setDownvotes] = useState<number>(0);
  const [userVoted, setUserVoted] = useState<'up' | 'down' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [imagePreview, setImagePreview] = useState({ open: false, src: '' });

  // Custom theme colors
  const customColors = {
    primary: theme.palette.mode === 'dark' ? '#E0E0E0' : '#2C3E50',    // Sophisticated gray/slate
    secondary: theme.palette.mode === 'dark' ? '#90A4AE' : '#34495E',  // Muted blue-gray
    accent: theme.palette.mode === 'dark' ? '#78909C' : '#546E7A',     // Steel blue-gray
    background: theme.palette.mode === 'dark' ? '#121212' : '#F5F6F7',
    cardBg: theme.palette.mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
    text: theme.palette.mode === 'dark' ? '#E0E0E0' : '#2C3E50',
    border: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    hover: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    success: theme.palette.mode === 'dark' ? '#81C784' : '#2ECC71',    // Modern green
    error: theme.palette.mode === 'dark' ? '#E57373' : '#E74C3C',      // Modern red
    tag: {
      bg: theme.palette.mode === 'dark' ? '#263238' : '#ECEFF1',       // Tag background
      text: theme.palette.mode === 'dark' ? '#B0BEC5' : '#546E7A',     // Tag text
      hover: theme.palette.mode === 'dark' ? '#37474F' : '#CFD8DC'     // Tag hover
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!post) {
        setError('Post not found. The post might have been deleted or you may not have permission to view it.');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [post]);

  const handleUpvote = () => {
    try {
      if (userVoted === 'up') {
        setUpvotes((prev: number) => prev - 1);
        setUserVoted(null);
      } else {
        if (userVoted === 'down') {
          setDownvotes((prev: number) => prev - 1);
        }
        setUpvotes((prev: number) => prev + 1);
        setUserVoted('up');
      }
      setSnackbar({ open: true, message: 'Vote recorded successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to record vote', severity: 'error' });
    }
  };

  const handleDownvote = () => {
    try {
      if (userVoted === 'down') {
        setDownvotes((prev: number) => prev - 1);
        setUserVoted(null);
      } else {
        if (userVoted === 'up') {
          setUpvotes((prev: number) => prev - 1);
        }
        setDownvotes((prev: number) => prev + 1);
        setUserVoted('down');
      }
      setSnackbar({ open: true, message: 'Vote recorded successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to record vote', severity: 'error' });
    }
  };

  const handleCommentSubmit = () => {
    if (!comment.getCurrentContent().hasText()) {
      setSnackbar({ open: true, message: 'Comment cannot be empty', severity: 'error' });
      return;
    }

    const contentState = comment.getCurrentContent();
    const rawContent = JSON.stringify(convertToRaw(contentState));

    const newComment: Comment = {
      id: Date.now().toString(),
      author: {
        name: 'Current User',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      content: rawContent,
      date: new Date().toLocaleDateString(),
      upvotes: 0,
      downvotes: 0,
    };

    setComments([newComment, ...comments]);
    setComment(EditorState.createEmpty());
    setSnackbar({ open: true, message: 'Comment posted successfully', severity: 'success' });
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 2,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'white',
          }}
        >
          <ErrorOutline sx={{ fontSize: 60, color: theme.palette.error.main }} />
          <Typography variant="h5" color="error" align="center">
            {error || 'Post not found'}
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Please check the URL or try accessing the post through the blog page.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/blog')} 
            startIcon={<ArrowBack />}
            sx={{ mt: 2 }}
          >
            Back to Blog
          </Button>
        </Paper>
      </Container>
    );
  }

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link', 'image'
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4, bgcolor: customColors.background, minHeight: '100vh' }}>
      <Button
        onClick={() => navigate('/blog')}
        startIcon={<ArrowBack />}
        sx={{ 
          mb: 4,
          color: customColors.text,
          bgcolor: customColors.tag.bg,
          '&:hover': {
            bgcolor: customColors.tag.hover,
          }
        }}
      >
        Back to Blog
      </Button>

      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 2, md: 4 }, 
          mb: 4,
          borderRadius: 2,
          bgcolor: customColors.cardBg,
          border: `1px solid ${customColors.border}`,
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 8px 32px rgba(255,255,255,0.03)' 
            : '0 8px 32px rgba(0,0,0,0.03)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 12px 48px rgba(255,255,255,0.05)' 
              : '0 12px 48px rgba(0,0,0,0.05)',
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
        }}>
          {/* Content Section */}
          <Box sx={{ 
            flex: '1 1 auto',
            maxWidth: { md: post.image ? '55%' : '100%' },
          }}>
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                fontWeight: 800,
                color: customColors.primary,
                mb: 3,
                fontSize: { xs: '1.8rem', md: '2.4rem' }
              }}
            >
              {post.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Avatar 
                src={post.author.avatar} 
                sx={{ 
                  mr: 2,
                  width: 56,
                  height: 56,
                  border: `2px solid ${customColors.accent}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }} 
              />
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: customColors.primary
                  }}
                >
                  {post.author.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: customColors.accent,
                    fontSize: '0.9rem'
                  }}
                >
                  Posted on {new Date().toLocaleDateString()}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
              {post.tags && post.tags.map((tag: string) => (
                <Chip
                  key={tag}
                  label={tag}
                  sx={{ 
                    mr: 1, 
                    mb: 1,
                    bgcolor: customColors.tag.bg,
                    color: customColors.tag.text,
                    fontWeight: 500,
                    border: `1px solid ${customColors.border}`,
                    '&:hover': {
                      bgcolor: customColors.tag.hover,
                    }
                  }}
                />
              ))}
            </Box>

            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: '1.1rem', 
                lineHeight: 1.8,
                color: customColors.text,
                mb: 4,
                letterSpacing: '0.3px'
              }}
            >
              {post.preview}
            </Typography>

            <Stack 
              direction="row" 
              spacing={2} 
              alignItems="center" 
              sx={{ 
                mb: 4,
                p: 2,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                borderRadius: 2,
                border: `1px solid ${customColors.border}`
              }}
            >
              <IconButton 
                onClick={handleUpvote}
                sx={{
                  color: userVoted === 'up' ? customColors.success : customColors.text,
                  '&:hover': {
                    color: customColors.success,
                    bgcolor: theme.palette.mode === 'dark' 
                      ? 'rgba(129, 199, 132, 0.1)' 
                      : 'rgba(46, 204, 113, 0.1)',
                  }
                }}
              >
                <Badge 
                  badgeContent={upvotes} 
                  color="success"
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: userVoted === 'up' ? customColors.success : 'grey',
                      color: 'white',
                    }
                  }}
                >
                  <ArrowUpward />
                </Badge>
              </IconButton>

              <IconButton 
                onClick={handleDownvote}
                sx={{
                  color: userVoted === 'down' ? customColors.error : customColors.text,
                  '&:hover': {
                    color: customColors.error,
                    bgcolor: theme.palette.mode === 'dark' 
                      ? 'rgba(229, 115, 115, 0.1)' 
                      : 'rgba(231, 76, 60, 0.1)',
                  }
                }}
              >
                <Badge 
                  badgeContent={downvotes} 
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: userVoted === 'down' ? customColors.error : 'grey',
                      color: 'white',
                    }
                  }}
                >
                  <ArrowDownward />
                </Badge>
              </IconButton>

              <IconButton
                sx={{
                  color: customColors.text,
                  '&:hover': {
                    color: customColors.secondary,
                    bgcolor: customColors.hover,
                  }
                }}
              >
                <Share />
              </IconButton>
            </Stack>
          </Box>

          {/* Image Section */}
          {post.image && (
            <Box sx={{ 
              flex: '1 1 45%',
              position: 'sticky',
              top: 24,
              alignSelf: 'stretch',
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              height: 'calc(100vh - 48px)',
            }}>
              <Box 
                sx={{ 
                  width: '100%',
                  height: 'auto',
                  position: 'relative',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover .zoom-overlay': {
                    opacity: 1,
                  },
                }}
                onClick={() => setImagePreview({ open: true, src: post.image })}
              >
                <img 
                  src={post.image} 
                  alt={post.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    borderRadius: '12px',
                    filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))',
                    transition: 'filter 0.3s ease'
                  }}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
                  }}
                />
                <Box
                  className="zoom-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s ease-in-out',
                  }}
                >
                  <ZoomIn sx={{ color: 'white', fontSize: 40 }} />
                </Box>
              </Box>
            </Box>
          )}

          {/* Mobile Image Section */}
          {post.image && (
            <Box sx={{ 
              width: '100%',
              display: { xs: 'block', md: 'none' },
              mb: 4
            }}>
              <Box 
                sx={{ 
                  width: '100%',
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative',
                  bgcolor: customColors.background,
                  cursor: 'pointer',
                  aspectRatio: '16/9',
                  '&:hover .zoom-overlay': {
                    opacity: 1,
                  },
                }}
                onClick={() => setImagePreview({ open: true, src: post.image })}
              >
                <img 
                  src={post.image} 
                  alt={post.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))',
                    transition: 'filter 0.3s ease'
                  }}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
                  }}
                />
                <Box
                  className="zoom-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s ease-in-out',
                  }}
                >
                  <ZoomIn sx={{ color: 'white', fontSize: 40 }} />
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        {/* Image Preview Modal */}
        <Modal
          open={imagePreview.open}
          onClose={() => setImagePreview({ ...imagePreview, open: false })}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              bgcolor: customColors.cardBg,
              borderRadius: 2,
              p: 2,
              outline: 'none',
            }}
          >
            <IconButton
              onClick={() => setImagePreview({ ...imagePreview, open: false })}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: customColors.text,
                bgcolor: customColors.hover,
                '&:hover': {
                  bgcolor: customColors.accent,
                  color: customColors.cardBg,
                },
              }}
            >
              <Close />
            </IconButton>
            <img
              src={imagePreview.src}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: 'calc(90vh - 4rem)',
                objectFit: 'contain',
                borderRadius: '12px',
                filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))',
                transition: 'filter 0.3s ease'
              }}
            />
          </Box>
        </Modal>

        {/* Comments Section */}
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            color: customColors.primary,
            mb: 3
          }}
        >
          Comments
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <DraftEditor
              editorState={comment}
              onChange={setComment}
              placeholder="Share your thoughts..."
              // Add additional configurations or toolbars as needed
            />
          </Paper>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleCommentSubmit}
              disabled={!comment.getCurrentContent().hasText()}
              sx={{
                bgcolor: '#0a95ff',
                '&:hover': { bgcolor: '#0074cc' },
                color: 'white',
              }}
            >
              Post Comment
            </Button>
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          {comments.map((comment) => (
            <Paper
              key={comment.id}
              elevation={0}
              sx={{
                p: 3,
                mb: 2,
                borderRadius: 2,
                bgcolor: customColors.cardBg,
                border: `1px solid ${customColors.border}`,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 2
                }}
              >
                <Avatar 
                  src={comment.author.avatar} 
                  alt={comment.author.name}
                  sx={{ 
                    width: 48,
                    height: 48,
                    border: `2px solid ${customColors.accent}`
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: customColors.primary }}>
                    {comment.author.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: customColors.accent }}>
                    {comment.date}
                  </Typography>
                </Box>
              </Box>
              <Typography 
                variant="body1" 
                sx={{ 
                  mt: 1,
                  color: customColors.text,
                  lineHeight: 1.6,
                  '& img': {
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: 1,
                    my: 2
                  }
                }}
                dangerouslySetInnerHTML={{ __html: comment.content }}
              />
              <Stack 
                direction="row" 
                spacing={1} 
                alignItems="center" 
                sx={{ mt: 2 }}
              >
                <IconButton size="small">
                  <Badge badgeContent={comment.upvotes} color="success">
                    <ArrowUpward fontSize="small" />
                  </Badge>
                </IconButton>
                <IconButton size="small">
                  <Badge badgeContent={comment.downvotes} color="error">
                    <ArrowDownward fontSize="small" />
                  </Badge>
                </IconButton>
              </Stack>
            </Paper>
          ))}
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            bgcolor: snackbar.severity === 'success' ? '#4CAF50' : '#f44336',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BlogPostDetail;
