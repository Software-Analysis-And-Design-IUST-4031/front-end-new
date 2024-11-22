import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';

const ProfileHeader: React.FC = () => {
  return (
    <Box display="flex" alignItems="center">
      <Avatar sx={{ width: 64, height: 64, bgcolor: "#f0f0f0", mr: 2 }}>U</Avatar>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>Username Name Surname</Typography>
        <Typography variant="body2" color="textSecondary">
          Description here...
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfileHeader;
