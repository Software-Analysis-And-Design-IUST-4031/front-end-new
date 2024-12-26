import React from 'react';
import Title from './title/title';
import Mygif1 from './Animation/Animation';
import Paitings from './paintings/Paintings';
import Painter from './painters/painters';
import Navbar from '../Navbar';
import { Box } from '@mui/material';

const MainPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Navbar />
      <Box sx={{ paddingTop: '64px' }}>  {/* Add padding to account for fixed navbar */}
        <Title/>
        <Painter />
        <Mygif1 />
        <Paitings/>
      </Box>
    </Box>
  );
};

export default MainPage;
