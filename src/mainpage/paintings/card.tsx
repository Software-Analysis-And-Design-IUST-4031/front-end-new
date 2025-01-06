import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  styled,
} from '@mui/material';

interface Post {
  painting_id: string;
  image: string;
  description: string;
  title: string;
  price: string;  
  material: string;
  artist: string;
  year: number;
  style: string;
}

interface CardProps {
  posts: Post[];
}

const PostCard = styled(Paper)(({ theme }) => ({
  width: '100%',
  background: 'transparent',
  boxShadow: 'none',
  position: 'relative',
  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-12px)',
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  paddingTop: '125%',
  borderRadius: '24px',
  overflow: 'hidden',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 10px 30px rgba(0,0,0,0.3)'
      : '0 10px 30px rgba(0,0,0,0.1)',
}));

const PostImage = styled('img')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
});

const PostInfo = styled(Box)(({ theme }) => ({
  marginTop: '16px',
  position: 'relative',
}));

const PostTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  fontWeight: 700,
  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  marginBottom: '8px',
}));

const PostMeta = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const PostPrice = styled(Typography)(({ theme }) => ({
    fontSize: '1.2rem',
    fontWeight: 800,
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #3f51b5, #2196f3)'
      : 'linear-gradient(135deg, #1a237e, #1976d2)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
  }));

const CardItem: React.FC<{ post: Post }> = ({ post }) => {
  const [showDialog, setShowDialog] = useState(false);

  const handleDialogOpen = () => {
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  return (
    <>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <PostCard elevation={0}>
          <ImageContainer onClick={handleDialogOpen}>
            <PostImage src={post.image}/>
          </ImageContainer>
          <PostInfo>
            <PostTitle>
              {post.title}
              
            </PostTitle>
            <PostPrice>${post.price}</PostPrice>
          </PostInfo>
        </PostCard>
      </Grid>

      <Dialog open={showDialog} onClose={handleDialogClose} maxWidth="md">
        <DialogTitle>
          {post.title}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <img
              src={post.image}
              alt={post.title || 'Painting image'}
              style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
            />
            <Typography variant="body1">{post.description}</Typography>
            
            <Typography variant="subtitle2" color="textSecondary">
              Year: {post.year}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Style: {post.style}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Material: {post.material}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const Card: React.FC<CardProps> = ({ posts }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {posts.map((post) => (
          <CardItem key={post.painting_id} post={post} />
        ))}
      </Grid>
    </Box>
  );
};

export default Card;