import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

interface ProfileStatsProps {
  followers: number;
  following: number;
  posts: number
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ followers, following, posts }) => {
  const theme = useTheme();
  
  return (
    <Box display="flex" justifyContent="center" gap={4} my={1}>
      <Box textAlign="center">
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'inherit' }}>{posts}</Typography>
        <Typography variant="body2" sx={{ color: 'inherit', opacity: 0.8 }}>Posts</Typography>
      </Box>
      <Box textAlign="center">
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'inherit' }}>{followers}</Typography>
        <Typography variant="body2" sx={{ color: 'inherit', opacity: 0.8 }}>Followers</Typography>
      </Box>
      <Box textAlign="center">
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'inherit' }}>{following}</Typography>
        <Typography variant="body2" sx={{ color: 'inherit', opacity: 0.8 }}>Following</Typography>
      </Box>
    </Box>
  );
};

export default ProfileStats;
