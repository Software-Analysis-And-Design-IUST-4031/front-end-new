import React, { useState, useCallback, useEffect } from "react";
import { IconButton, Snackbar, Alert } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { styled, keyframes } from "@mui/material/styles";
import { userService } from "../services/userService";

// Animation for the heart icon when liking
const popAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
`;

// Animation for the floating heart
const floatAnimation = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px) scale(1.5);
  }
`;

const HeartIcon = styled(FavoriteIcon)`
  &.liked {
    animation: ${popAnimation} 0.3s ease-in-out;
    color: #ff3040;
  }
`;

const FloatingHeart = styled("div")`
  position: absolute;
  animation: ${floatAnimation} 0.8s ease-out forwards;
  color: #ff3040;
  pointer-events: none;
`;

interface LikeButtonProps {
  paintingId: number;
  initialLikeCount: number;
  initialLiked: boolean;
  onLikeChange?: (liked: boolean, count: number) => void;
}

const DOUBLE_TAP_DELAY = 300; // ms
const ERROR_DISPLAY_DURATION = 3000; // ms

export const LikeButton: React.FC<LikeButtonProps> = ({
  paintingId,
  initialLikeCount,
  initialLiked,
  onLikeChange,
}) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showFloatingHeart, setShowFloatingHeart] = useState(false);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Update local state when props change
  useEffect(() => {
    setLiked(initialLiked);
    setLikeCount(initialLikeCount);
  }, [initialLiked, initialLikeCount]);

  const handleLikeAction = useCallback(async () => {
    if (isUpdating) return;

    const previousState = {
      liked,
      likeCount,
    };

    try {
      setIsUpdating(true);
      setError(null);

      // Optimistic update
      const newLiked = !liked;
      const optimisticCount = likeCount + (newLiked ? 1 : -1);

      setLiked(newLiked);
      setLikeCount(optimisticCount);

      if (newLiked) {
        setShowFloatingHeart(true);
        setTimeout(() => setShowFloatingHeart(false), 800);
      }

      // Actual API call
      const response = await userService.toggleLikePainting(paintingId);

      // Update with real data
      setLiked(response.hasLiked);
      setLikeCount(response.likes_count);
      setRetryCount(0); // Reset retry count on success

      // Notify parent
      onLikeChange?.(response.hasLiked, response.likes_count);
    } catch (error: any) {
      // Revert on error
      setLiked(previousState.liked);
      setLikeCount(previousState.likeCount);

      // Handle specific error cases
      if (error.message.includes("log in")) {
        setError("Please log in to like paintings");
      } else if (error.message.includes("Server error")) {
        setError("Server error. Please try again later");
        // Retry logic for server errors
        if (retryCount < 2) {
          setRetryCount((prev) => prev + 1);
          setTimeout(() => handleLikeAction(), 1000 * (retryCount + 1));
        }
      } else {
        setError(error.message || "Failed to update like status");
      }
    } finally {
      setIsUpdating(false);
    }
  }, [paintingId, liked, likeCount, isUpdating, onLikeChange, retryCount]);

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      const currentTime = Date.now();

      // Check for double tap
      if (currentTime - lastTapTime < DOUBLE_TAP_DELAY) {
        if (!liked) {
          handleLikeAction();
        }
      } else {
        // Single tap
        handleLikeAction();
      }

      setLastTapTime(currentTime);
    },
    [lastTapTime, liked, handleLikeAction]
  );

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <>
      <div style={{ position: "relative", display: "inline-block" }}>
        <IconButton
          onClick={handleClick}
          disabled={isUpdating}
          size="large"
          aria-label={liked ? "unlike" : "like"}
        >
          {liked ? <HeartIcon className="liked" /> : <FavoriteBorderIcon />}
        </IconButton>
        {showFloatingHeart && (
          <FloatingHeart>
            <FavoriteIcon />
          </FloatingHeart>
        )}
        <span>{likeCount}</span>
      </div>
      <Snackbar
        open={!!error}
        autoHideDuration={ERROR_DISPLAY_DURATION}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};
