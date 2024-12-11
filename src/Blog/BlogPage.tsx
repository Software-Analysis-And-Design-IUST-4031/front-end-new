import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  TextField,
  Chip,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  IconButton,
  Avatar,
  useTheme,
  alpha,
  Card,
  CardContent,
  Fade,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Edit, 
  Search, 
  ArrowUpward, 
  ArrowDownward, 
  Bookmark, 
  Share,
  TrendingUp,
  Comment,
  Visibility,
  ArrowBack
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface BlogPost {
  id: string;
  title: string;
  preview: string;
  author: {
    name: string;
    avatar: string;
    reputation: number;
    followers: number;
  };
  votes: number;
  answers: number;
  views: number;
  tags: string[];
  createdAt: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
}

const samplePosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Renaissance of Impressionism in Modern Art',
    preview: 'Exploring how contemporary artists are reimagining Impressionist techniques with a modern twist. The interplay of light and color continues to captivate...',
    author: {
      name: 'Isabella Martinez',
      avatar: 'https://i.pravatar.cc/150?img=1',
      reputation: 11259,
      followers: 1520,
    },
    votes: 325,
    answers: 48,
    views: 12000,
    tags: ['impressionism', 'modern-art', 'oil-painting', 'art-history'],
    createdAt: '2024-03-15',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    likes: 542,
    comments: 89,
    shares: 156,
  },
  {
    id: '2',
    title: 'Mastering Color Theory in Digital Art',
    preview: 'Understanding color relationships and how to effectively use them in your digital artwork. From complementary colors to color harmonies...',
    author: {
      name: 'Michael Chen',
      avatar: 'https://i.pravatar.cc/150?img=2',
      reputation: 8742,
      followers: 890,
    },
    votes: 275,
    answers: 35,
    views: 9500,
    tags: ['digital-art', 'color-theory', 'art-fundamentals'],
    createdAt: '2024-03-14',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    likes: 420,
    comments: 65,
    shares: 112,
  },
  {
    id: '3',
    title: 'Abstract Expressionism in the Digital Age',
    preview: 'How digital tools are revolutionizing abstract expressionism while maintaining its emotional core. A look at the intersection of traditional and digital techniques...',
    author: {
      name: 'Sarah O\'Connor',
      avatar: 'https://i.pravatar.cc/150?img=3',
      reputation: 6523,
      followers: 675,
    },
    votes: 198,
    answers: 34,
    views: 7500,
    tags: ['digital-art', 'abstract', 'expressionism', 'mixed-media'],
    createdAt: '2024-03-13',
    likes: 367,
    comments: 52,
    shares: 93,
  },
  {
    id: '4',
    title: 'The Art of Portrait Painting: Beyond Likeness',
    preview: 'Discovering the subtle techniques that transform a portrait from mere resemblance to a window into the subject\'s soul. Tips and insights from master portrait artists...',
    author: {
      name: 'Elena Rossi',
      avatar: 'https://i.pravatar.cc/150?img=4',
      reputation: 9876,
      followers: 1230,
    },
    votes: 412,
    answers: 73,
    views: 15600,
    tags: ['portrait', 'oil-painting', 'classical-art', 'technique'],
    createdAt: '2024-03-12',
    likes: 634,
    comments: 128,
    shares: 245,
  }
];

const BlogPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(
    id ? samplePosts.find(post => post.id === id) || null : null
  );
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>(samplePosts);

  const handlePostClick = (post: BlogPost) => {
    navigate(`/blog/${post.id}`, { state: { post } });
  };

  const handleBackToList = () => {
    setSelectedPost(null);
    navigate('/blog');
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.preview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => post.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'popular':
        return b.views - a.views;
      case 'votes':
        return b.votes - a.votes;
      default:
        return 0;
    }
  });

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

  if (selectedPost) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          onClick={handleBackToList}
          sx={{ mb: 4 }}
          startIcon={<ArrowBack />}
        >
          Back to Posts
        </Button>
        <BlogPost
          id={selectedPost.id}
          title={selectedPost.title}
          author={{
            name: selectedPost.author.name,
            avatar: selectedPost.author.avatar,
          }}
          date={selectedPost.createdAt}
          readTime="5 min"
          content={selectedPost.preview} // In a real app, this would be the full content
          preview={selectedPost.preview}
          tags={selectedPost.tags}
          image={selectedPost.image}
          likes={selectedPost.likes}
          rating={4.5} // This would come from the API in a real app
          comments={[]} // This would come from the API in a real app
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Art Blog & Community
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Discover art techniques, share your work, and connect with fellow artists
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="popular">Most Popular</MenuItem>
              <MenuItem value="votes">Most Votes</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate('/blog/new')}
            sx={{
              background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
              border: 0,
              borderRadius: 2,
              boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
              color: 'white',
              height: 48,
              padding: '0 30px',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 10px 2px rgba(255, 105, 135, .3)',
              },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            Write Post
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {allTags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            onClick={() => {
              setSelectedTags(prev =>
                prev.includes(tag)
                  ? prev.filter(t => t !== tag)
                  : [...prev, tag]
              );
            }}
            color={selectedTags.includes(tag) ? 'primary' : 'default'}
          />
        ))}
      </Box>

      <Grid container spacing={3}>
        {sortedPosts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <Paper
              sx={{
                p: 3,
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4],
                },
              }}
              onClick={() => handlePostClick(post)}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={post.image ? 8 : 12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={post.author.avatar} sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {post.author.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(post.createdAt).toLocaleDateString()} · 5 min read
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    {post.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {post.preview}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    {post.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTags(prev =>
                            prev.includes(tag)
                              ? prev.filter(t => t !== tag)
                              : [...prev, tag]
                          );
                        }}
                      />
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUp 
                        sx={{ 
                          mr: 1, 
                          fontSize: 20,
                          color: '#4CAF50', // Material-UI green color
                          transition: 'transform 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.1)',
                          }
                        }} 
                      />
                      <Typography variant="body2">{post.votes} votes</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Comment sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="body2">{post.comments} comments</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Visibility sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="body2">{post.views} views</Typography>
                    </Box>
                  </Box>
                </Grid>
                {post.image && (
                  <Grid item xs={12} md={4}>
                    <Box
                      sx={{
                        width: '100%',
                        height: 200,
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={post.image}
                        alt={post.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

const BlogPost = ({
  id,
  title,
  author,
  date,
  readTime,
  content,
  preview,
  tags,
  image,
  likes,
  rating,
  comments,
}: {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  content: string;
  preview: string;
  tags: string[];
  image?: string;
  likes: number;
  rating: number;
  comments: any[];
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" />
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Avatar src={author.avatar} sx={{ width: 48, height: 48 }} />
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {author.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {date} · {readTime}
          </Typography>
        </Box>
      </Box>

      {image && (
        <Box
          sx={{
            width: '100%',
            height: 400,
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <img
            src={image}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
      )}

      <Typography variant="body1" sx={{ mb: 4 }}>
        {content}
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TrendingUp sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="body2">{likes} likes</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Comment sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="body2">{comments.length} comments</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            Rating:
          </Typography>
          <Typography variant="body2" sx={{ color: 'primary.main' }}>
            {rating}/5
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default BlogPage;
