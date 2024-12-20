import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DescriptionSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: '600px', textAlign: 'center', mb: 4 }}>
      <Typography variant="h2" gutterBottom>
        Welcome to Art Blog
      </Typography>
      <Typography variant="body1" gutterBottom>
        Share and explore amazing artworks from around the world.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </Button>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
}

export default DescriptionSection;
