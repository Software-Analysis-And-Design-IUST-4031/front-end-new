import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { userService } from "../../services/userService";
import { styled, keyframes } from "@mui/material/styles";

interface LikeButtonProps {
  paintingId: number;
  onClick?: (e: React.MouseEvent) => void;
  sx?: any;
  isLiked?: boolean;
  likesCount?: number;
}

// Enhanced pop animation
const popAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

// Enhanced floating animation
const floatAnimation = keyframes`
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-20px) scale(1.2);
    opacity: 0;
  }
`;

const HeartIcon = styled(FavoriteIcon)(({ theme }) => ({
  color: "#FF3B30",
  animation: `${popAnimation} 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)`,
  filter: "drop-shadow(0 2px 4px rgba(255,59,48,0.3))",
}));

const FloatingHeart = styled(Box)({
  position: "absolute",
  animation: `${floatAnimation} 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
  pointerEvents: "none",
  zIndex: 10,
});

const LikeButton: React.FC<LikeButtonProps> = ({
  paintingId,
  onClick,
  sx,
  isLiked: initialIsLiked,
  likesCount: initialLikesCount,
}) => {
  const theme = useTheme();
  const [isLiked, setIsLiked] = useState(initialIsLiked || false);
  const [likesCount, setLikesCount] = useState(initialLikesCount || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [showFloatingHeart, setShowFloatingHeart] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync with props
  useEffect(() => {
    if (initialIsLiked !== undefined) setIsLiked(initialIsLiked);
    if (initialLikesCount !== undefined) setLikesCount(initialLikesCount);
  }, [initialIsLiked, initialLikesCount]);

  // Fetch initial state
  useEffect(() => {
    const fetchLikeState = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const [currentLikeStatus, currentLikeCount] = await Promise.all([
          userService.checkUserLikedPainting(parseInt(userId), paintingId),
          userService.GetlikePainting(paintingId),
        ]);

        setIsLiked(currentLikeStatus);
        setLikesCount(currentLikeCount);
      } catch (error) {
        console.error("Error fetching like state:", error);
      }
    };

    if (initialIsLiked === undefined || initialLikesCount === undefined) {
      fetchLikeState();
    }
  }, [paintingId, initialIsLiked, initialLikesCount]);

  const handleLikeAction = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Please log in to like paintings");
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);

      // Get current state before any action
      const currentLikeStatus = await userService.checkUserLikedPainting(
        parseInt(userId),
        paintingId
      );

      // Only proceed if the state is different from what we think it is
      if (currentLikeStatus === isLiked) {
        // Make API call based on current state
        if (currentLikeStatus) {
          // Currently liked, so unlike
          await userService.unlikePainting(paintingId);
        } else {
          // Currently unliked, so like
          await userService.likePainting(paintingId);
        }

        // Get the updated state
        const [newLikeStatus, newLikeCount] = await Promise.all([
          userService.checkUserLikedPainting(parseInt(userId), paintingId),
          userService.GetlikePainting(paintingId),
        ]);

        // Show animation only when liking
        if (newLikeStatus && !currentLikeStatus) {
          setShowFloatingHeart(true);
          setTimeout(() => setShowFloatingHeart(false), 500);
        }

        // Update state with verified data
        setIsLiked(newLikeStatus);
        setLikesCount(newLikeCount);

        // Notify parent if needed
        if (onClick) onClick(e);
      }
    } catch (error) {
      console.error("Like action error:", error);
      setError("Failed to update like status");

      // Fetch current state on error
      const [currentLikeStatus, currentLikeCount] = await Promise.all([
        userService.checkUserLikedPainting(parseInt(userId), paintingId),
        userService.GetlikePainting(paintingId),
      ]);

      // Update with actual state from backend
      setIsLiked(currentLikeStatus);
      setLikesCount(currentLikeCount);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        ...sx,
      }}
    >
      <IconButton
        onClick={handleLikeAction}
        disabled={isLoading}
        size="small"
        sx={{
          color: isLiked
            ? "#FF3B30"
            : theme.palette.mode === "dark"
            ? "#fff"
            : "#000",
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
      >
        {isLoading ? (
          <CircularProgress size={20} color="inherit" />
        ) : isLiked ? (
          <HeartIcon />
        ) : (
          <FavoriteBorderIcon />
        )}
      </IconButton>

      {showFloatingHeart && (
        <FloatingHeart>
          <FavoriteIcon sx={{ color: "#FF3B30" }} />
        </FloatingHeart>
      )}

      <Typography
        variant="body2"
        sx={{
          ml: 0.5,
          userSelect: "none",
          color: theme.palette.mode === "dark" ? "#fff" : "inherit",
        }}
      >
        {likesCount}
      </Typography>

      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LikeButton;
