import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Box,
  IconButton,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  styled,
  keyframes,
  Fade,
  Badge,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

interface Post {
  id: string;
  imageUrl: string;
  caption: string;
  title: string;
  price: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
}

interface CardProps {
  posts: Post[];
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
}

const PostCard = styled(Paper)(({ theme }) => ({
  width: '100%',
  background: 'transparent',
  boxShadow: 'none',
  position: 'relative',
  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-12px)',
    '& .image-container': {
      boxShadow: theme.palette.mode === 'dark' 
        ? '0 20px 40px rgba(0,0,0,0.4)'
        : '0 20px 40px rgba(0,0,0,0.15)',
      '&::after': {
        opacity: 1,
      },
      '& .post-image': {
        transform: 'scale(1.05)',
      },
      '& .post-actions': {
        opacity: 1,
      }
    }
  }
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  paddingTop: '125%',
  borderRadius: '24px',
  overflow: 'hidden',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 10px 30px rgba(0,0,0,0.3)'
    : '0 10px 30px rgba(0,0,0,0.1)',
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 100%)',
    opacity: 0,
    transition: 'opacity 0.5s ease',
  },
  className: 'image-container'
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

const PostActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  zIndex: 2,
  className: 'post-actions'
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: '#fff',
  backgroundColor: 'rgba(255,255,255,0.1)',
  backdropFilter: 'blur(8px)',
  padding: '12px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: 'scale(1.1)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.4rem',
  },
  '&.liked': {
    color: '#ff1744',
    backgroundColor: 'rgba(255,23,68,0.2)',
  },
  '&.saved': {
    color: '#2196f3',
    backgroundColor: 'rgba(33,150,243,0.2)',
  }
}));

const PostInfo = styled(Box)(({ theme }) => ({
  marginTop: '16px',
  position: 'relative',
  height: '60px', // Reduced height since we're using single line
}));

const PostTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  fontWeight: 700,
  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
  letterSpacing: '-0.01em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap', // Force single line
  marginBottom: '8px',
}));

const PostMeta = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
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

const LikeCount = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  color: theme.palette.text.secondary,
  '& .MuiSvgIcon-root': {
    fontSize: '1.1rem',
  }
}));

const CardItem: React.FC<{
  post: Post;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
}> = ({ post, onLike, onSave, onShare }) => {
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
            <PostImage src={post.imageUrl} alt={post.title} />
            <PostActions>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <ActionButton
                  className={post.isLiked ? 'liked' : ''}
                  onClick={(e) => {
                    e.stopPropagation();
                    onLike(post.id);
                  }}
                >
                  {post.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </ActionButton>
                <ActionButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare(post.id);
                  }}
                >
                  <ShareIcon />
                </ActionButton>
              </Box>
              <ActionButton
                className={post.isSaved ? 'saved' : ''}
                onClick={(e) => {
                  e.stopPropagation();
                  onSave(post.id);
                }}
              >
                {post.isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </ActionButton>
            </PostActions>
          </ImageContainer>
          <PostInfo>
            <PostTitle>{post.title}</PostTitle>
            <PostMeta>
              <PostPrice>${post.price}</PostPrice>
              <LikeCount>
                <FavoriteIcon />
                {post.likes}
              </LikeCount>
            </PostMeta>
          </PostInfo>
        </PostCard>
      </Grid>

      <Dialog open={showDialog} onClose={handleDialogClose} maxWidth="md">
        <DialogTitle>{post.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <img src={post.imageUrl} alt={post.title} style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }} />
            <Typography variant="body1">{post.caption}</Typography>
            <Typography variant="h6" color="primary">${post.price}</Typography>
            <Typography variant="caption" color="text.secondary">
              Posted on: {new Date(post.createdAt).toLocaleDateString()}
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

const Card: React.FC<CardProps> = ({ posts, onLike, onSave, onShare }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {posts.map((post) => (
          <CardItem
            key={post.id}
            post={post}
            onLike={onLike}
            onSave={onSave}
            onShare={onShare}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default Card;
