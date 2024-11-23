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
  CircularProgress,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

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

interface PostGridProps {
  posts: Post[];
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
}

interface PostGridItemProps {
  post: Post;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
}

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PostCard = styled(Paper)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  paddingTop: '100%',
  overflow: 'hidden',
  borderRadius: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
    '& .overlay': {
      opacity: 1,
    },
    '& .post-info': {
      transform: 'translateY(0)',
      opacity: 1,
    },
    '& .post-actions': {
      transform: 'translateY(0)',
      opacity: 1,
    }
  },
}));

const ImageContainer = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: '#f0f0f0',
  overflow: 'hidden',
});

const PostImage = styled('img')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.3s ease',
});

const Overlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.7) 100%)',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '16px',
});

const PostInfo = styled(Box)({
  color: '#fff',
  transform: 'translateY(20px)',
  opacity: 0,
  transition: 'all 0.3s ease',
});

const TopInfo = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: 'auto',
});

const PostTitle = styled(Typography)({
  fontSize: '1.25rem',
  fontWeight: 600,
  marginBottom: '4px',
  color: '#fff',
});

const PostPrice = styled(Typography)({
  fontSize: '1.1rem',
  fontWeight: 500,
  color: '#fff',
  background: 'rgba(0, 0, 0, 0.5)',
  padding: '4px 12px',
  borderRadius: '20px',
  display: 'inline-block',
});

const PostActions = styled(Box)({
  display: 'flex',
  gap: '8px',
  transform: 'translateY(-20px)',
  opacity: 0,
  transition: 'all 0.3s ease',
});

const ActionButton = styled(IconButton)({
  color: '#fff',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(4px)',
  padding: '8px',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  '&.liked': {
    color: '#ff1744',
  },
  '&.saved': {
    color: '#2196f3',
  },
});

const LoadingPlaceholder = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: theme.palette.grey[200],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ErrorFallback = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.error.light,
  color: theme.palette.error.contrastText,
  borderRadius: theme.spacing(1),
  textAlign: 'center',
}));

const PostGridItem: React.FC<PostGridItemProps> = ({ post, onLike, onSave, onDelete, onShare }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  if (imageError) {
    return (
      <ErrorFallback>
        <Typography variant="body1">Failed to load image</Typography>
      </ErrorFallback>
    );
  }

  return (
    <Fade in={true} timeout={500}>
      <PostCard elevation={0}>
        <ImageContainer>
          {isLoading && (
            <LoadingPlaceholder>
              <CircularProgress size={40} thickness={4} />
            </LoadingPlaceholder>
          )}
          <PostImage
            src={post.imageUrl}
            alt={post.title}
            onLoad={() => setIsLoading(false)}
            onError={handleImageError}
            style={{ opacity: isLoading ? 0 : 1 }}
          />
          <Overlay className="overlay">
            <TopInfo>
              <PostTitle variant="h6">
                {post.title}
              </PostTitle>
              <PostPrice>
                {post.price}
              </PostPrice>
            </TopInfo>
            <Box>
              <PostActions className="post-actions">
                <Tooltip title={post.isLiked ? "Unlike" : "Like"}>
                  <Badge badgeContent={post.likes} color="primary">
                    <ActionButton
                      className={post.isLiked ? 'liked' : ''}
                      onClick={(e) => {
                        e.stopPropagation();
                        try {
                          onLike(post.id);
                        } catch (error) {
                          console.error('Error liking post:', error);
                        }
                      }}
                    >
                      {post.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </ActionButton>
                  </Badge>
                </Tooltip>
                <Tooltip title={post.isSaved ? "Unsave" : "Save"}>
                  <ActionButton
                    className={post.isSaved ? 'saved' : ''}
                    onClick={(e) => {
                      e.stopPropagation();
                      try {
                        onSave(post.id);
                      } catch (error) {
                        console.error('Error saving post:', error);
                      }
                    }}
                  >
                    {post.isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                  </ActionButton>
                </Tooltip>
                <Tooltip title="Share">
                  <ActionButton
                    onClick={(e) => {
                      e.stopPropagation();
                      try {
                        onShare(post.id);
                      } catch (error) {
                        console.error('Error sharing post:', error);
                      }
                    }}
                  >
                    <ShareIcon />
                  </ActionButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <ActionButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteDialog(true);
                    }}
                  >
                    <DeleteOutlineIcon />
                  </ActionButton>
                </Tooltip>
              </PostActions>
              <PostInfo className="post-info">
                <Typography variant="body2" sx={{ mt: 1, color: '#fff' }}>
                  {post.caption}
                </Typography>
              </PostInfo>
            </Box>
          </Overlay>
        </ImageContainer>

        <Dialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
            },
          }}
        >
          <DialogTitle>Delete Post</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button
              onClick={() => {
                try {
                  onDelete(post.id);
                  setShowDeleteDialog(false);
                } catch (error) {
                  console.error('Error deleting post:', error);
                }
              }}
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </PostCard>
    </Fade>
  );
};

const PostGrid: React.FC<PostGridProps> = ({ posts, onLike, onSave, onDelete, onShare }) => {
  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto', p: 3 }}>
      <Grid 
        container 
        spacing={4}
      >
        {posts.map((post) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4}
            key={post.id}
          >
            <PostGridItem
              post={post}
              onLike={onLike}
              onSave={onSave}
              onDelete={onDelete}
              onShare={onShare}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PostGrid;
