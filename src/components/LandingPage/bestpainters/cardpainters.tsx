import React, { useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  Card,
  Avatar,
  Tooltip,
  Skeleton,
  Badge,
} from "@mui/material";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { alpha } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import { styled } from "@mui/material/styles";

interface Post {
  user_id: string;
  username: string;
  profile_picture: string;
  total_likes: number;
}

interface PostCardProps {
  post: Post;
}

const StyledCard = styled(motion(Card))(({ theme }) => ({
  position: "relative",
  width: 280,
  height: 320,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: 30,
  overflow: "hidden",
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(169deg, rgba(45,45,45,0.8) 0%, rgba(25,25,25,0.9) 100%)"
      : "linear-gradient(169deg, rgba(255,255,255,0.9) 0%, rgba(245,245,245,0.95) 100%)",
  backdropFilter: "blur(10px)",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 8px 32px rgba(0, 0, 0, 0.3)"
      : "0 8px 32px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-10px)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(45deg, rgba(100,100,100,0.1), rgba(150,150,150,0.1))"
        : "linear-gradient(45deg, rgba(255,255,255,0.4), rgba(255,255,255,0.2))",
    borderRadius: 30,
  },
}));

const AvatarWrapper = styled(Box)({
  position: "relative",
  marginTop: 30,
  zIndex: 1,
});

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(45deg, #FFD700, #FFA500)"
        : "linear-gradient(45deg, #FFD700, #FF8C00)",
    border: `3px solid ${theme.palette.background.paper}`,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
}));

const UsernameWrapper = styled(Box)({
  marginTop: 24,
  textAlign: "center",
  zIndex: 1,
  padding: "0 20px",
});

const StatsWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 16,
  marginTop: 24,
  zIndex: 1,
});

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const theme = useTheme();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageUrl = post.profile_picture
    ? `http://127.0.0.1:8000${post.profile_picture}`
    : "";

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <StyledCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AvatarWrapper>
        <AnimatePresence mode="wait">
          {!imageLoaded && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: "absolute", inset: 0 }}
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
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <Tooltip title="Top Artist" placement="top">
              <WorkspacePremiumIcon
                sx={{
                  fontSize: 24,
                  color: theme.palette.mode === "dark" ? "#000" : "#FFF",
                }}
              />
            </Tooltip>
          }
        >
          <Avatar
            src={imageUrl}
            alt={post.username}
            sx={{
              width: 120,
              height: 120,
              border: "4px solid",
              borderColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.1)",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
              fontSize: "2.5rem",
            }}
            onError={handleImageError}
            onLoad={handleImageLoad}
          >
            {post.username.substring(0, 2).toUpperCase()}
          </Avatar>
        </StyledBadge>
      </AvatarWrapper>

      <UsernameWrapper>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: theme.palette.mode === "dark" ? "#fff" : "#000",
            textShadow:
              theme.palette.mode === "dark"
                ? "0 2px 4px rgba(0,0,0,0.5)"
                : "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {post.username}
        </Typography>
      </UsernameWrapper>

      <StatsWrapper>
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: theme.palette.mode === "dark" ? "#FFD700" : "#FF8C00",
            }}
          >
            {post.total_likes}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 500,
            }}
          >
            Total Likes
          </Typography>
        </Box>
      </StatsWrapper>
    </StyledCard>
  );
};

export default PostCard;
