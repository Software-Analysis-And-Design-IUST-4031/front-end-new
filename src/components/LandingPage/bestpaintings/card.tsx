import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  alpha,
  Skeleton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';

interface Post {
  painting_id: string;
  title: string;
  description: string;
  image: string | null;
  creation_date: string;
  price: number;
}

interface PostCardProps {
  post: Post;
  onShare?: (id: string) => void;
}

const StyledCard = styled(motion(Card))`
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 30px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${({ theme }) => 
    theme.palette.mode === 'dark'
      ? 'linear-gradient(169deg, rgba(45,45,45,0.6) 0%, rgba(25,25,25,0.8) 100%)'
      : 'linear-gradient(169deg, rgba(255,255,255,0.8) 0%, rgba(245,245,245,0.9) 100%)'
  };
  box-shadow: ${({ theme }) =>
    theme.palette.mode === 'dark'
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : '0 8px 32px rgba(0, 0, 0, 0.1)'
  };

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 30px;
    padding: 1.5px;
    background: linear-gradient(
      45deg,
      ${({ theme }) => alpha(theme.palette.primary.main, 0.3)},
      ${({ theme }) => alpha(theme.palette.secondary.main, 0.3)}
    );
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.6;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${({ theme }) =>
      theme.palette.mode === 'dark'
        ? '0 16px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 255, 255, 0.1) inset'
        : '0 16px 40px rgba(0, 0, 0, 0.15), 0 0 20px rgba(255, 255, 255, 0.4) inset'
    };

    &::before {
      opacity: 1;
    }
  }
`;

const ImageWrapper = styled(Box)`
  position: relative;
  padding-top: 133%;
  overflow: hidden;
  border-radius: 30px 30px 0 0;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      transparent 60%,
      rgba(0, 0, 0, 0.8) 100%
    );
    opacity: 0;
    transition: opacity 0.4s ease-in-out;
  }

  .MuiCard-root:hover &::after {
    opacity: 1;
  }
`;

const ContentOverlay = styled(Box)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px;
  transform: translateY(100%);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.8) 50%,
    transparent 100%
  );
  
  .MuiCard-root:hover & {
    transform: translateY(0);
  }
`;

const PriceTag = styled(Box)`
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 10px 20px;
  background: ${({ theme }) =>
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.98)'
      : 'rgba(255, 255, 255, 0.98)'
  };
  border-radius: 30px;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-100%);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  
  .MuiCard-root:hover & {
    transform: translateY(0);
    opacity: 1;
  }
`;

const defaultImage = '/path/to/default/image.jpg';

const PostCard: React.FC<PostCardProps> = ({ post, onShare }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const theme = useTheme();

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  const formattedDate = new Date(post.creation_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(post.price);

  const imageUrl = post.image || defaultImage;

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      <StyledCard
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        onClick={handleOpenDialog}
        sx={{
          cursor: 'pointer',
          backgroundColor: theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.8)
            : alpha(theme.palette.background.paper, 0.9),
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(255, 255, 255, 0.1)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <ImageWrapper>
          <AnimatePresence mode="wait">
            {!imageLoaded && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.05)',
                  borderRadius: '30px 30px 0 0',
                }}
              >
                <Skeleton 
                  variant="rectangular" 
                  width="100%" 
                  height="100%"
                  animation="wave"
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          <CardMedia
            component="img"
            image={imageUrl}
            alt={post.title}
            onLoad={() => setImageLoaded(true)}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '30px 30px 0 0',
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '.MuiCard-root:hover &': {
                transform: 'scale(1.05)',
              },
            }}
          />

          <PriceTag>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: theme.palette.mode === 'dark' ? '#000' : '#000',
              }}
            >
              ${post.price}
            </Typography>
          </PriceTag>

          <ContentOverlay>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#fff',
                mb: 1,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {post.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              {formattedDate}
            </Typography>
          </ContentOverlay>
        </ImageWrapper>
      </StyledCard>

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundImage: 'none',
            backgroundColor: theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.9)
              : alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(10px)',
          },
        }}
      >
        <DialogTitle>
          <Typography 
            variant="h5" 
            component="div"
            fontWeight={700}
          >
            {post.title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <CardMedia
              component="img"
              image={imageUrl}
              alt={post.title}
              sx={{
                width: '100%',
                borderRadius: 2,
                mb: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
            <Typography variant="body1" paragraph>
              {post.description}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {formattedDate}
            </Typography>
            <Typography variant="h6" color="primary" fontWeight={600}>
              {formattedPrice}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Close
          </Button>
          {onShare && (
            <Button
              variant="contained"
              onClick={() => {
                onShare(post.painting_id);
                handleCloseDialog();
              }}
            >
              Share
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PostCard;
