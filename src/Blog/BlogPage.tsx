import React, { useState } from 'react';
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Edit, Search, ArrowUpward, ArrowDownward, Bookmark, Share } from '@mui/icons-material';

interface BlogPost {
  id: string;
  title: string;
  preview: string;
  author: {
    name: string;
    avatar: string;
    reputation: number;
  };
  votes: number;
  answers: number;
  views: number;
  tags: string[];
  createdAt: string;
}

const samplePosts: BlogPost[] = [
  {
    id: '1',
    title: 'How to implement authentication in React with JWT?',
    preview: 'I am trying to implement authentication in my React application using JWT tokens...',
    author: {
      name: 'Lucy Johnsone aziz',
      avatar: 'https://i.pravatar.cc/150?img=1',
      reputation: 11259,
    },
    votes: 25,
    answers: 3,
    views: 1200,
    tags: ['react', 'awli', 'ajab'],
    createdAt: '2024-03-15',
  },
  {
    id: '2',
    title: 'Best practices for React state management in 2024',
    preview: 'What are the current best practices for managing state in React applications?...',
    author: {
      name: 'Jane Smith',
      avatar: 'https://i.pravatar.cc/150?img=2',
      reputation: 518,
    },
    votes: 42,
    answers: 5,
    views: 2300,
    tags: ['1', '2', '3', 'hala', 'bikhiale', 'ghosse'],
    createdAt: '2024-03-14',
  },
];

const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAskQuestion = () => {
    navigate('/blog/new');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          All Questions
        </Typography>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={handleAskQuestion}
          sx={{
            bgcolor: '#0a95ff',
            '&:hover': { bgcolor: '#0074cc' },
            color: 'white',
            px: 3,
          }}
        >
          Ask Question
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Sort</InputLabel>
              <Select
                value={sortBy}
                label="Sort"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="newest">Newest</MenuItem>
                <MenuItem value="votes">Most votes</MenuItem>
                <MenuItem value="answers">Most answers</MenuItem>
                <MenuItem value="views">Most views</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Box>
        {samplePosts.map((post, index) => (
          <Paper
            key={post.id}
            sx={{
              p: 3,
              mb: 2,
              '&:hover': {
                boxShadow: 2,
              },
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={2}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'text.secondary' }}>
                  <Typography variant="h6">{post.votes}</Typography>
                  <Typography variant="body2">votes</Typography>
                  <Box sx={{ my: 1 }}>
                    <Typography variant="h6">{post.answers}</Typography>
                    <Typography variant="body2">answers</Typography>
                  </Box>
                  <Typography variant="body2">{post.views} views</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={10}>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    color: '#0074cc',
                    '&:hover': {
                      color: '#0a95ff',
                      cursor: 'pointer',
                    },
                  }}
                  onClick={() => navigate(`/blog/${post.id}`)}
                >
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                  {post.preview}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  {post.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{
                        bgcolor: '#e1ecf4',
                        color: '#39739d',
                        '&:hover': {
                          bgcolor: '#d0e3f1',
                          cursor: 'pointer',
                        },
                      }}
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small">
                      <ArrowUpward />
                    </IconButton>
                    <IconButton size="small">
                      <ArrowDownward />
                    </IconButton>
                    <IconButton size="small">
                      <Bookmark />
                    </IconButton>
                    <IconButton size="small">
                      <Share />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      asked {post.createdAt}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        style={{ width: 32, height: 32, borderRadius: '50%' }}
                      />
                      <Box>
                        <Typography variant="body2" color="#0074cc" sx={{ '&:hover': { color: '#0a95ff' } }}>
                          {post.author.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {post.author.reputation.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

export default BlogPage;
