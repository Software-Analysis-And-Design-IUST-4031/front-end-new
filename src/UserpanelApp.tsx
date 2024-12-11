import React from 'react';
import './Themes.css';
import ProfilePage from './userpanel/ProfilePage';
import { useTheme } from '@mui/material';
import { useColorMode } from './App';

const UserpanelApp: React.FC = () => {
  const theme = useTheme();
  const { mode } = useColorMode();

  return (
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
  );
};

export default UserpanelApp;
