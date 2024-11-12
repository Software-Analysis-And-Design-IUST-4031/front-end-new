// PostGrid.tsx
import React from 'react';
import { Grid, Box, Typography } from '@mui/material';

interface Post {
  title: string;
  price: string;
  description: string;
  image: string;
}

interface PostGridProps {
  posts: Post[];
}

const PostGrid: React.FC<PostGridProps> = ({ posts }) => {
  posts.forEach(post => console.log("Image source:", post.image)); // For debugging

  return (
    <Grid container spacing={3}>
      {posts.map((post, i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <Box
            sx={{
              position: 'relative',
              borderRadius: 2,
              overflow: 'hidden',
              width: '100%',
              paddingBottom: '75%',
              backgroundColor: '#f0f0f0',
            }}
          >
            <img
              src={post.image}
              alt={post.title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 'inherit',
              }}
            />
            <Box
              position="absolute"
              bottom={0}
              left={0}
              p={1}
              bgcolor="rgba(0, 0, 0, 0.6)"
              color="#fff"
              width="100%"
            >
              <Typography variant="subtitle2" noWrap>{post.title}</Typography>
              <Typography variant="caption">{post.price}</Typography>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default PostGrid;
