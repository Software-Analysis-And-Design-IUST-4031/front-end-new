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
        py: 8, // Increased padding to make the component taller
        px: 2,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
        borderRadius: 2,
        boxShadow: 3,
        mt: 20,
        mb: 20,
        maxWidth: 1500, // Limit the component's width
        width: '90%', // Ensure it doesn't exceed 90% of the parent container
        margin: '0 auto', // Center the component
        position: 'relative',
        overflow: 'hidden',  
      }}
    >
      <Box
        component="img"
        src={mygif}
        alt="Art Shop Animation"
        sx={{
          maxWidth: 300, // Fixed width for the image
          width: '100%', // Ensure it scales proportionally
          borderRadius: 2,
          boxShadow: 1,
          mb: { xs: 4, md: 0 },
          maxHeight: 400, // Fixed height for the image
        }}
      />
      <Box
        sx={{
          ml: { md: 4 },
          textAlign: { xs: 'center', md: 'left' },
          maxWidth: 400, // Fixed width for the text container
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
        </Typography>
      </Box>
    </Box>
  );
};

export default Mygif1;