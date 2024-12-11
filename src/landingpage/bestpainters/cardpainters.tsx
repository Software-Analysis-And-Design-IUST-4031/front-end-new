import React from 'react';
import {
  Grid,
  Paper,
  Box,
  Typography,
  styled,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface Post {
  id: string;
  imageUrl: string;
  artist: string;
  likes: number;
}

interface CardProps {
  posts: Post[];
}

// Styled Components
const PostCard = styled(Paper)({
  width: '100%',
  background: 'transparent',
  boxShadow: 'none',
  position: 'relative',
  transition: 'transform 0.5s ease',
  '&:hover': {
    transform: 'translateY(-12px)',
  },
});

const ImageContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  paddingTop: '125%',
  borderRadius: '12px',
  overflow: 'hidden',
});

const PostImage = styled('img')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const PostInfo = styled(Box)({
  marginTop: '16px',
});

const PostTitle = styled(Typography)({
  fontSize: '1.2rem',
  fontWeight: 700,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const LikeCount = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  marginTop: '8px',
});

const CardItem: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <PostCard>
        <ImageContainer>
          <PostImage src={post.imageUrl} alt={post.artist} />
        </ImageContainer>

        <PostInfo>
          <PostTitle>{post.artist}</PostTitle>
          <LikeCount>
            <FavoriteIcon />
            {post.likes}
          </LikeCount>
        </PostInfo>
      </PostCard>
    </Grid>
  );
};

const Card: React.FC<CardProps> = ({ posts }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {posts.map((post) => (
          <CardItem key={post.id} post={post} />
        ))}
      </Grid>
    </Box>
  );
};

export default Card;
