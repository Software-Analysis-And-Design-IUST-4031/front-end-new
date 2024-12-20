import React from 'react';
import { ThemeProvider, createTheme, Box } from '@mui/material';
import { CssBaseline } from '@mui/material';
import { useColorMode } from '../App';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';

  const muiTheme = createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#ff4081',
      },
      background: {
        default: isDark ? '#121212' : '#f5f5f5',
        paper: isDark ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isDark ? '#121212' : '#f5f5f5',
        }}
      >
        {children}
      </Box>
    </ThemeProvider>
  );
};

export default AuthLayout;
