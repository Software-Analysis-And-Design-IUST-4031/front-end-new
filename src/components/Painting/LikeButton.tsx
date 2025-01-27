import React, { useState, useEffect } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { userService } from "../../services/userService";

interface LikeButtonProps {
  paintingId: number;
  onLike?: () => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({ paintingId, onLike }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        const user_id = localStorage.getItem("userId");
        if (!user_id) throw new Error("User ID is missing in localStorage.");

        const likeCount = await userService.GetlikePainting(paintingId);
        const userLiked = await userService.checkUserLikedPainting(
          parseInt(user_id),
          paintingId
        );

        setLikeCount(likeCount);
        setIsLiked(userLiked);
      } catch (error) {
        console.error("Error fetching like data:", error);
      }
    };

    fetchLikeData();
  }, [paintingId]);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    if (loading) return;

    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("Please log in to like paintings");
      return;
    }

    setLoading(true);

    try {
      const newLiked = !isLiked;
      setIsLiked(newLiked);
      setLikeCount((prevCount) => (newLiked ? prevCount + 1 : prevCount - 1));

      // Call the backend to toggle like/unlike
      const response = await userService.toggleLikePainting(paintingId);

      // Update with server response
      setIsLiked(response.hasLiked);
      setLikeCount(response.likes_count);

      // Trigger heart animation if liking
      if (!isLiked && onLike) {
        onLike();
      }
    } catch (error) {
      console.error("Error toggling like:", error);

      // Revert optimistic update on error
      setIsLiked((prevLiked) => !prevLiked);
      setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={handleLikeClick}
      style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
    >
      {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
      <span style={{ marginLeft: "8px", color: "inherit" }}>{likeCount}</span>
    </div>
  );
};

export default LikeButton;
