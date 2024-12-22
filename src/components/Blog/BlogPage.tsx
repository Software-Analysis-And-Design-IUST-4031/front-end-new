import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  useTheme,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Fade,
  Divider,
  alpha,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import blogService, { Blog } from '../../services/blogService';
import Navbar from '../Navbar';
import { useAuth } from '../../context/AuthContext';

const BlogPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { username } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filter, setFilter] = useState('all');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await blogService.getBlogs();
        setBlogs(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value as string);
  };

  const handleFilterChange = (event: any) => {
    setFilter(event.target.value as string);
  };

  const handleCreatePost = () => {
    navigate('/blog/create');
  };

  const handleViewBlog = (blogId: number) => {
    navigate(`/blog/${blogId}`);
  };

  const filteredAndSortedBlogs = blogs
    .filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          blog.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filter === 'all') return matchesSearch;
      if (filter === 'my' && username) return matchesSearch && blog.author.username === username;
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return 0;
    });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <>
      <Navbar />
      <Box 
        sx={{ 
          background: theme.palette.mode === 'dark' 
            ? `linear-gradient(180deg, 
                ${alpha(theme.palette.common.black, 0.4)} 0%,
                ${alpha(theme.palette.common.black, 0.2)} 50%,
                transparent 100%)`
            : `linear-gradient(180deg, 
                ${alpha(theme.palette.common.black, 0.05)} 0%,
                ${alpha(theme.palette.common.black, 0.02)} 50%,
                transparent 100%)`,
          pt: 8,
          pb: 6,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            background: `radial-gradient(circle at 50% 0%, 
              ${alpha(theme.palette.mode === 'dark' ? '#fff' : '#000', 0.03)} 0%, 
              transparent 70%)`,
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center" sx={{ mb: 6 }}>
            <Grid item xs={12} md={7}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 900,
                  letterSpacing: -1.5,
                  color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2,
                  mb: 3,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -16,
                    left: 0,
                    width: 80,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
                  },
                }}
              >
                Art Blog
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.common.white, 0.7)
                    : alpha(theme.palette.common.black, 0.6),
                  fontWeight: 400,
                  mb: 4,
                  maxWidth: 600,
                  lineHeight: 1.6,
                }}
              >
                Share your artistic journey and connect with fellow artists in our creative community
              </Typography>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={handleCreatePost}
                sx={{
                  borderRadius: '32px',
                  px: 6,
                  py: 2,
                  bgcolor: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
                  color: theme.palette.mode === 'dark' ? theme.palette.common.black : theme.palette.common.white,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 0 20px rgba(255, 255, 255, 0.1)'
                    : '0 0 20px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' 
                      ? alpha(theme.palette.common.white, 0.9)
                      : alpha(theme.palette.common.black, 0.8),
                    transform: 'translateY(-3px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 0 30px rgba(255, 255, 255, 0.2)'
                      : '0 0 30px rgba(0, 0, 0, 0.2)',
                  },
                  '&:active': {
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                Create New Post
              </Button>
            </Grid>
          </Grid>

          <Paper 
            elevation={0} 
            sx={{ 
              p: 4,
              borderRadius: '32px',
              backgroundColor: theme.palette.mode === 'dark'
                ? alpha(theme.palette.common.white, 0.05)
                : alpha(theme.palette.common.black, 0.02),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${
                theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.white, 0.1)
                  : alpha(theme.palette.common.black, 0.05)
              }`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '100%',
                background: `radial-gradient(circle at 0% 0%, 
                  ${alpha(theme.palette.mode === 'dark' ? '#fff' : '#000', 0.03)} 0%, 
                  transparent 50%)`,
                pointerEvents: 'none',
              },
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon 
                        sx={{ 
                          color: theme.palette.text.secondary,
                          mr: 1,
                          transition: 'color 0.3s ease',
                        }} 
                      />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '24px',
                      backgroundColor: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.common.white, 0.05)
                        : alpha(theme.palette.common.black, 0.02),
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.common.white, 0.08)
                          : alpha(theme.palette.common.black, 0.04),
                        transform: 'translateY(-1px)',
                        '& .MuiSvgIcon-root': {
                          color: theme.palette.mode === 'dark'
                            ? theme.palette.common.white
                            : theme.palette.common.black,
                        },
                      },
                      '&.Mui-focused': {
                        backgroundColor: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.common.white, 0.1)
                          : alpha(theme.palette.common.black, 0.05),
                        transform: 'translateY(-1px)',
                        boxShadow: theme.palette.mode === 'dark'
                          ? '0 0 20px rgba(255, 255, 255, 0.1)'
                          : '0 0 20px rgba(0, 0, 0, 0.1)',
                        '& .MuiSvgIcon-root': {
                          color: theme.palette.mode === 'dark'
                            ? theme.palette.common.white
                            : theme.palette.common.black,
                        },
                      },
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.common.white, 0.1)
                          : alpha(theme.palette.common.black, 0.1),
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.common.white, 0.2)
                          : alpha(theme.palette.common.black, 0.2),
                      },
                    },
                    '& .MuiInputBase-input': {
                      py: 1.5,
                      px: 2,
                      fontSize: '1rem',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SortIcon sx={{ mr: 1 }} /> Sort By
                    </Box>
                  </InputLabel>
                  <Select
                    value={sortBy}
                    onChange={handleSortChange}
                    label="Sort By"
                    sx={{ 
                      borderRadius: '24px',
                      backgroundColor: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.common.white, 0.05)
                        : alpha(theme.palette.common.black, 0.02),
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.common.white, 0.1)
                          : alpha(theme.palette.common.black, 0.1),
                      },
                    }}
                  >
                    <MenuItem value="newest">Newest First</MenuItem>
                    <MenuItem value="oldest">Oldest First</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FilterIcon sx={{ mr: 1 }} /> Filter
                    </Box>
                  </InputLabel>
                  <Select
                    value={filter}
                    onChange={handleFilterChange}
                    label="Filter"
                    sx={{ 
                      borderRadius: '24px',
                      backgroundColor: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.common.white, 0.05)
                        : alpha(theme.palette.common.black, 0.02),
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.common.white, 0.1)
                          : alpha(theme.palette.common.black, 0.1),
                      },
                    }}
                  >
                    <MenuItem value="all">All Posts</MenuItem>
                    {username && <MenuItem value="my">My Posts</MenuItem>}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress size={40} />
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredAndSortedBlogs.map((blog) => (
              <Grid item xs={12} sm={6} md={4} key={blog.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '28px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    backgroundColor: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.common.white, 0.05)
                      : alpha(theme.palette.common.black, 0.02),
                    border: `1px solid ${
                      theme.palette.mode === 'dark'
                        ? alpha(theme.palette.common.white, 0.1)
                        : alpha(theme.palette.common.black, 0.05)
                    }`,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `radial-gradient(circle at 50% 0%, 
                        ${alpha(theme.palette.mode === 'dark' ? '#fff' : '#000', 0.03)} 0%, 
                        transparent 70%)`,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    },
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 20px 40px rgba(0, 0, 0, 0.3)'
                        : '0 20px 40px rgba(0, 0, 0, 0.1)',
                      '& .MuiCardMedia-root': {
                        transform: 'scale(1.1)',
                      },
                      '& .blog-overlay': {
                        opacity: 1,
                        background: theme.palette.mode === 'dark'
                          ? 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)'
                          : 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                      },
                      '&::before': {
                        opacity: 1,
                      },
                      border: `1px solid ${
                        theme.palette.mode === 'dark'
                          ? alpha(theme.palette.common.white, 0.2)
                          : alpha(theme.palette.common.black, 0.1)
                      }`,
                    },
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onClick={() => handleViewBlog(blog.id)}
                >
                  <Box sx={{ position: 'relative', pt: '60%' }}>
                    <CardMedia
                      component="img"
                      image={blog.image || '/placeholder-image.jpg'}
                      alt={blog.title}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease-in-out',
                      }}
                    />
                    <Box
                      className="blog-overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease-in-out',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
                    <Typography 
                      variant="h5" 
                      component="h2" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 700,
                        letterSpacing: -0.5,
                        color: theme.palette.mode === 'dark' 
                          ? theme.palette.common.white 
                          : theme.palette.common.black,
                      }}
                    >
                      {blog.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.6,
                      }}
                    >
                      {blog.content}
                    </Typography>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 2,
                        mt: 'auto',
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32,
                          bgcolor: theme.palette.mode === 'dark' 
                            ? alpha(theme.palette.common.white, 0.1)
                            : alpha(theme.palette.common.black, 0.1),
                        }}
                      >
                        <PersonIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {blog.author.username}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: theme.palette.mode === 'dark'
                              ? alpha(theme.palette.common.white, 0.6)
                              : alpha(theme.palette.common.black, 0.6),
                          }}
                        >
                          {formatDate(blog.created_at)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  <Divider sx={{ mx: 2 }} />
                  <CardActions sx={{ px: 2, py: 1.5, justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2" color="text.secondary">
                        {blog.author.username}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(blog.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
            {filteredAndSortedBlogs.length === 0 && (
              <Grid item xs={12}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  minHeight="200px"
                >
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    No blog posts found
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default BlogPage;
