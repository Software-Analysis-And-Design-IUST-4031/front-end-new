import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
const LikeCounter: React.FC<{ paintingId: number }> = ({ paintingId }) => {
  const [likeCount, setLikeCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const count = await userService.GetlikePainting(paintingId);
        setLikeCount(count);
      } catch (error) {
        console.error('Failed to fetch like count:', error);
        setLikeCount(0); 
      }
    };

    fetchLikeCount();
  }, [paintingId]);

  return (
    <div>
      {/* Convert number to ReactNode by directly rendering it */}
      {likeCount !== null ? likeCount : 'Loading...'}
    </div>
  );
};

export default LikeCounter;
