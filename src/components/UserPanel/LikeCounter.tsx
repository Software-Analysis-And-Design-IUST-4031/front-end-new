import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { userService } from "../../services/userService";

interface LikeButtonProps {
  paintingId: number;
  onClick?: (e: React.MouseEvent) => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({ paintingId, onClick }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const count = await userService.GetlikePainting(paintingId);
        setLikesCount(count);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };
    fetchLikes();
  }, [paintingId]);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await userService.toggleLikePainting(
        paintingId,
        isLiked
      );
      setIsLiked(!isLiked);
      setLikesCount(response.likes_count);
      if (onClick) onClick(e);
    } catch (error: any) {
      if (error.response?.status === 400) {
        const currentLikes = await userService.GetlikePainting(paintingId);
        setLikesCount(currentLikes);
        setIsLiked(!isLiked);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <IconButton
        onClick={handleLikeClick}
        disabled={isLoading}
        size="small"
        sx={{
          color: isLiked ? "error.main" : "inherit",
          p: 0.5,
        }}
        component="span"
      >
        {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
      <Typography variant="body2" sx={{ ml: 0.5 }}>
        {likesCount}
      </Typography>
    </Box>
  );
};

export default LikeButton;
