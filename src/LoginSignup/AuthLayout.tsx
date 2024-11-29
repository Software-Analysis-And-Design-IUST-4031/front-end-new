import React from 'react';
import { Box, MantineProvider } from '@mantine/core';
import { useColorMode } from '../App';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { mode } = useColorMode();
  const isDark = mode === 'dark';

  return (
    <MantineProvider>
      <Box
        style={{
          minHeight: '100vh',
          width: '100%',
          background: isDark 
            ? 'linear-gradient(135deg, #1A1B1E 0%, #25262B 100%)'
            : 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          margin: 0
        }}
      >
        {children}
      </Box>
    </MantineProvider>
  );
};

export default AuthLayout;
