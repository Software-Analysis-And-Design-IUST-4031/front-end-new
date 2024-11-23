import React from 'react';
import './Themes.css';
import ProfilePage from './userpanel/ProfilePage';
import { IconButton, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useColorMode } from './App';

const UserpanelApp: React.FC = () => {
  const theme = useTheme();
  const { toggleColorMode, mode } = useColorMode();

  return (
    <>
      <IconButton
        onClick={toggleColorMode}
        color="inherit"
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          '&:hover': {
            bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
          },
          zIndex: 1300,
        }}
      >
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          padding: theme.spacing(3),
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
        }}
      >
        <ProfilePage />
      </div>
    </>
  );
};

export default UserpanelApp;
