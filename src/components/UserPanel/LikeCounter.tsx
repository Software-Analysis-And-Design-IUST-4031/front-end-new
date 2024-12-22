import React, { useState, useEffect } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { userService } from '../../services/userService';

const LikeButton: React.FC<{ paintingId: number }> = ({ paintingId }) => {
  const [isLiked, setIsLiked] = useState(false); // Tracks if painting is liked
  const [likeCount, setLikeCount] = useState<number>(0); // Tracks the number of likes

  // Fetch initial like count and liked state
  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        const likesCount = await userService.GetlikePainting(paintingId);
        setLikeCount(likesCount);

        // Placeholder logic for determining whether the painting is liked
        // If backend provides an endpoint to check user likes, integrate it
        const userLiked = false; // Replace with actual check if available
        setIsLiked(userLiked);
      } catch (error) {
        console.error('Error fetching like data:', error);
      }
    };

    fetchLikeData();
  }, [paintingId]);

  // Handle the like button click
  const handleLikeClick = async () => {
    try {
      // Optimistically toggle the like state
      setIsLiked((prevLiked) => {
        const newLiked = !prevLiked;
  
        // Adjust the like count based on the new state
        setLikeCount((prevCount) => newLiked ? prevCount + 1 : prevCount - 1);
  
        return newLiked;
      });
  
      // Call the backend to toggle the like/unlike
      await userService.toggleLikePainting(paintingId);
    } catch (error) {
      console.error('Error toggling like:', error);
  
      // Revert the optimistic update on error
      setIsLiked((prevLiked) => !prevLiked);
      setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    }
  };
  

  return (
    <div onClick={handleLikeClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
      <span style={{ marginLeft: '8px' }}>{likeCount}</span>
    </div>
  );
};

export default LikeButton;

