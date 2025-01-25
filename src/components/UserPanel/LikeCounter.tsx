import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, CircularProgress } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { userService } from "../../services/userService";

interface LikeButtonProps {
  paintingId: number;
  onClick?: (e: React.MouseEvent) => void;
  sx?: any;
  isLiked?: boolean;
  likesCount?: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  paintingId,
  onClick,
  sx,
  isLiked: controlledIsLiked,
  likesCount: controlledLikesCount,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use controlled values if provided
  const effectiveIsLiked = controlledIsLiked ?? isLiked;
  const effectiveLikesCount = controlledLikesCount ?? likesCount;

  const fetchLikeStatus = async () => {
    // Only fetch if not controlled
    if (controlledIsLiked !== undefined && controlledLikesCount !== undefined) {
      setIsLoading(false);
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const count = await userService.GetlikePainting(paintingId);
      const likeStatus = await userService.checkUserLikedPainting(
        parseInt(userId),
        paintingId
      );

      setLikesCount(count);
      setIsLiked(likeStatus.hasLiked);
    } catch (error) {
      console.error("Error fetching like status:", error);
      setError("Failed to load like status");
    }
  };

  useEffect(() => {
    const loadInitialState = async () => {
      setIsLoading(true);
      setError(null);
      await fetchLikeStatus();
      setIsLoading(false);
    };

    loadInitialState();
  }, [paintingId, controlledIsLiked, controlledLikesCount]);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    // If controlled, just call onClick
    if (controlledIsLiked !== undefined) {
      onClick?.(e);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newIsLiked = !effectiveIsLiked;

      // Make the API call first
      if (newIsLiked) {
        await userService.likePainting(paintingId);
      } else {
        await userService.unlikePainting(paintingId);
      }

      // Update UI after successful API call
      setIsLiked(newIsLiked);
      const newCount = await userService.GetlikePainting(paintingId);
      setLikesCount(newCount);

      // Notify parent component only when liking
      if (newIsLiked && onClick) {
        onClick(e);
      }
    } catch (error: any) {
      console.error("Error toggling like:", error);
      setError("Failed to update like status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        position: "relative",
        color: (theme) => (theme.palette.mode === "dark" ? "#fff" : "inherit"),
        ...sx,
      }}
    >
      <IconButton
        onClick={handleLikeClick}
        disabled={isLoading}
        className={effectiveIsLiked ? "liked" : ""}
        size="small"
        sx={{
          color: effectiveIsLiked ? "#FF3B30" : "inherit",
          p: 0.5,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.1)",
            backgroundColor: "rgba(255,255,255,0.1)",
          },
          opacity: isLoading ? 0.7 : 1,
          backgroundColor: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(4px)",
        }}
      >
        {isLoading ? (
          <CircularProgress size={20} color="inherit" />
        ) : effectiveIsLiked ? (
          <FavoriteIcon sx={{ color: "#FF3B30" }} />
        ) : (
          <FavoriteBorderIcon />
        )}
      </IconButton>
      <Typography
        variant="body2"
        sx={{
          ml: 0.5,
          minWidth: "20px",
          transition: "all 0.3s ease",
          opacity: isLoading ? 0.7 : 1,
          color: (theme) =>
            theme.palette.mode === "dark" ? "#FFFFFF" : "inherit",
          textShadow: "0 2px 4px rgba(0,0,0,0.2)",
          fontWeight: 600,
        }}
      >
        {effectiveLikesCount}
      </Typography>
      {error && (
        <Typography
          variant="caption"
          color="error"
          sx={{
            position: "absolute",
            bottom: -20,
            left: 0,
            whiteSpace: "nowrap",
            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default LikeButton;
