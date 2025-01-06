import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import mygif from './paintings.webp';

const Mygif1: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'center',
        py: 3,  
        px: 2,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
        borderRadius: 2,
        boxShadow: 3,
        mt: 20,
        mb: 20,
        maxHeight: 600,
        position: 'relative',
        overflow: 'hidden',  // Hide overflow to keep a clean look
      }}
    >
      <Box
        component="img"
        src={mygif}
        alt="Art Shop Animation"
        sx={{
          maxwidth: 400 ,
          borderRadius: 2,
          boxShadow: 1,
          mb: { xs: 4, md: 0 },
          maxHeight: 400,
        }}
      />
      <Box
        sx={{
          ml: { md: 4 },
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontWeight: 700,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(45deg, #fff 30%, #e0e0e0 90%)'
              : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          We have so many interesting things for you
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.secondary,
            lineHeight: 1.8,
            fontWeight: 400,
          }}
        >
          {/* Optional text here */}
        </Typography>
      </Box>
    </Box>
  );
};

export default Mygif1;