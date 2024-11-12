import React from 'react';
import { Box, Typography } from '@mui/material';

const ProfileStats: React.FC = () => {
  return (
    <Box display="flex" justifyContent="center" gap={4} my={1}>
      <Box textAlign="center">
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>6</Typography>
        <Typography variant="body2" color="textSecondary">Posts</Typography>
      </Box>
      <Box textAlign="center">
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>128</Typography>
        <Typography variant="body2" color="textSecondary">Followers</Typography>
      </Box>
      <Box textAlign="center">
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>34</Typography>
        <Typography variant="body2" color="textSecondary">Following</Typography>
      </Box>
    </Box>
  );
};

export default ProfileStats;
