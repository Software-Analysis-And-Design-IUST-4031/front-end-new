import React, { useState } from 'react';
import {
  Box,
  Typography,
  useTheme,
  Card,
  Avatar,
  Tooltip,
  Skeleton,
  Badge,
} from '@mui/material';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { alpha } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';

interface Post {
  user_id: string;
  username: string;
  profile_picture: string;
  total_likes: number;
}

interface PostCardProps {
  post: Post;
}

const StyledCard = styled(motion(Card))`
  position: relative;
  width: 280px;
  height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 30px;
  overflow: hidden;
  background: ${({ theme }) => 
    theme.palette.mode === 'dark' 
      ? 'linear-gradient(169deg, rgba(45,45,45,0.8) 0%, rgba(25,25,25,0.9) 100%)'
      : 'linear-gradient(169deg, rgba(255,255,255,0.9) 0%, rgba(245,245,245,0.95) 100%)'
  };
  backdrop-filter: blur(10px);
  box-shadow: ${({ theme }) =>
    theme.palette.mode === 'dark'
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : '0 8px 32px rgba(0, 0, 0, 0.1)'
  };
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(-10px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: ${({ theme }) =>
      theme.palette.mode === 'dark'
        ? 'linear-gradient(45deg, rgba(100,100,100,0.1), rgba(150,150,150,0.1))'
        : 'linear-gradient(45deg, rgba(255,255,255,0.4), rgba(255,255,255,0.2))'
    };
    border-radius: 30px;
  }
`;

const AvatarWrapper = styled(Box)`
  position: relative;
  margin-top: 30px;
  z-index: 1;
`;

const StyledAvatar = styled(Avatar)`
  width: 160px;
  height: 160px;
  border: 5px solid ${({ theme }) => 
    theme.palette.mode === 'dark' 
      ? 'rgba(255,255,255,0.1)'
      : 'rgba(255,255,255,0.8)'
  };
  box-shadow: ${({ theme }) =>
    theme.palette.mode === 'dark'
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : '0 8px 32px rgba(100, 100, 100, 0.2)'
  };
  transition: all 0.3s ease;

  ${StyledCard}:hover & {
    transform: scale(1.05);
    border-color: ${({ theme }) => theme.palette.primary.main};
  }
`;

const StyledBadge = styled(Badge)`
  .MuiBadge-badge {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: ${({ theme }) =>
      theme.palette.mode === 'dark'
        ? 'linear-gradient(45deg, #FFD700, #FFA500)'
        : 'linear-gradient(45deg, #FFD700, #FF8C00)'
    };
    border: 3px solid ${({ theme }) => theme.palette.background.paper};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const UsernameWrapper = styled(Box)`
  margin-top: 24px;
  text-align: center;
  z-index: 1;
  padding: 0 20px;
`;

const StatsWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
  padding: 12px 24px;
  background: ${({ theme }) =>
    theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.05)'
      : 'rgba(0,0,0,0.03)'
  };
  border-radius: 20px;
`;

const StatItem = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const cardVariants = {
  hidden: { 
    opacity: 0,
    y: 20,
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

function PostCard({ post }: PostCardProps) {
  const theme = useTheme();
  const [imageLoaded, setImageLoaded] = useState(false);
  const defaultImage = '/path/to/default/avatar.jpg';
  const imageUrl = post.profile_picture || defaultImage;

  return (
    <StyledCard
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <AvatarWrapper>
        <AnimatePresence mode="wait">
          {!imageLoaded && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <Skeleton
                variant="circular"
                width={160}
                height={160}
                animation="wave"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          badgeContent={
            <Tooltip title="Premium Artist" arrow placement="top">
              <WorkspacePremiumIcon sx={{ fontSize: 24, color: '#000' }} />
            </Tooltip>
          }
        >
          <StyledAvatar
            src={imageUrl}
            alt={post.username}
            onLoad={() => setImageLoaded(true)}
          />
        </StyledBadge>
      </AvatarWrapper>

      <UsernameWrapper>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: theme.palette.mode === 'dark' ? '#fff' : '#000',
            textShadow: theme.palette.mode === 'dark' 
              ? '0 2px 4px rgba(0,0,0,0.3)'
              : 'none',
            mb: 1
          }}
        >
          {post.username}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.mode === 'dark' 
              ? 'rgba(255,255,255,0.7)' 
              : 'rgba(0,0,0,0.6)',
            fontWeight: 500
          }}
        >
          Digital Artist
        </Typography>
      </UsernameWrapper>

      <StatsWrapper>
        <StatItem>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main
            }}
          >
            {post.total_likes}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.mode === 'dark' 
                ? 'rgba(255,255,255,0.7)' 
                : 'rgba(0,0,0,0.6)',
              fontWeight: 500
            }}
          >
            Likes
          </Typography>
        </StatItem>
      </StatsWrapper>
    </StyledCard>
  );
}

export default PostCard;
