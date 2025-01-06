import React from 'react';
import { Box, Grid, Paper, Typography, useTheme, styled } from '@mui/material';

interface Post {
  user_id: string;
  username: string;
  firstname: string;
  lastname: string;
  description: string;
  image: string;
  favorite_painting: string;
  favorite_painting_style: number;
  favorite_painter: string;
  city: string;
  country: string;
}

interface CardProps {
  posts: Post[];
}

const PostCard = styled(Paper)(({ theme }) => ({
  width: '100%',
  background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
  borderRadius: '24px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 8px 24px rgba(0,0,0,0.4)'
      : '0 8px 24px rgba(0,0,0,0.1)',
  },
}));

const CardContent = styled(Box)(({ theme }) => ({
  padding: '24px',
  color: theme.palette.text.primary,
}));

const Card: React.FC<CardProps> = ({ posts }) => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={4}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={post.user_id}>
            <PostCard elevation={0}>
              <Box
                sx={{
                  position: 'relative',
                  paddingTop: '100%',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={post.image}
                  alt={`${post.firstname} ${post.lastname}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                  }}
                >
                  {post.firstname} {post.lastname}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 2,
                    color: theme.palette.text.secondary,
                  }}
                >
                  {post.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255,255,255,0.05)' 
                        : 'rgba(0,0,0,0.05)',
                      padding: '4px 8px',
                      borderRadius: '12px',
                    }}
                  >
                    {post.city}, {post.country}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255,255,255,0.05)' 
                        : 'rgba(0,0,0,0.05)',
                      padding: '4px 8px',
                      borderRadius: '12px',
                    }}
                  >
                    {post.favorite_painting}
                  </Typography>
                </Box>
              </CardContent>
            </PostCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Card;