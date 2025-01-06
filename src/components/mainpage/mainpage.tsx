import React from 'react';
import Title from './title/title';
import Mygif1 from './Animation/Animation';
import Paitings from './paintings/Paintings';
import Painter from './painters/painters';
import Navbar from '../Navbar';
import { Box, useTheme } from '@mui/material';

const MainPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: theme.palette.background.default,
      color: theme.palette.text.primary,
      transition: 'background-color 0.3s, color 0.3s'
    }}>
      <Navbar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          p: 3,
          width: '95%',
          margin: '0 auto',
          maxWidth: '1800px',
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 4px 12px rgba(0,0,0,0.3)'
            : '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <Title/>
        <Painter />
        <Mygif1 />
        <Paitings/>
      </Box>
    </Box>
  );
};

export default MainPage;
