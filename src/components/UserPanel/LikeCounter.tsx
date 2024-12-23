import React, { useState, useEffect } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { userService } from '../../services/userService';

const LikeButton: React.FC<{ paintingId: number }> = ({ paintingId }) => {
  const [isLiked, setIsLiked] = useState(false); // Whether the user has liked this painting
  const [likeCount, setLikeCount] = useState<number>(0); // Total like count for the painting
  const [loading, setLoading] = useState(false); // Prevent multiple simultaneous requests

  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        const user_id = localStorage.getItem("userId");
        if (!user_id) throw new Error("User ID is missing in localStorage.");

        const likeCount = await userService.GetlikePainting(paintingId); // Total like count
        const userLiked = await userService.Getstatuslikepainting(paintingId, parseInt(user_id, 10)); // User's like status

        console.log('Fetched userLiked:', userLiked); // For debugging
        setLikeCount(likeCount); // Set total like count
        setIsLiked(userLiked); // Set user's like status
      } catch (error) {
        console.error('Error fetching like data:', error);
      }
    };

    fetchLikeData();
  }, [paintingId]);

  const handleLikeClick = async () => {
    if (loading) return; // Prevent multiple clicks while request is in progress
    setLoading(true);

    try {
      const newLiked = !isLiked;
      setIsLiked(newLiked);
      setLikeCount((prevCount) => (newLiked ? prevCount + 1 : prevCount - 1));

      // Call the backend to toggle like/unlike
      await userService.toggleLikePainting(paintingId);
    } catch (error) {
      console.error('Error toggling like:', error);

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
      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
    >
      {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
      <span style={{ marginLeft: '8px' }}>{likeCount}</span>
    </div>
  );
};

export default LikeButton;
