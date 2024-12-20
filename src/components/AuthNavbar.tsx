import React from 'react';
import { AppBar, Toolbar, Box, Button, Stack } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthNavbarProps {
  color?: 'black' | 'white';
}

const AuthNavbar: React.FC<AuthNavbarProps> = ({ color = 'black' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'transparent',
        boxShadow: 'none',
      }}
    >
      <Toolbar 
        sx={{ 
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          minHeight: '40px !important',
          position: 'relative',
          py: 1,
          pr: 4,
        }}
      >
        <Stack 
          direction="row" 
          spacing={4}
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Button
            onClick={() => navigate('/login')}
            sx={{
              color,
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
              px: 2,
              py: 0.5,
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              background: 'transparent',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -2,
                left: '50%',
                width: isActive('/login') ? '32px' : '0%',
                height: '2.5px',
                backgroundColor: color,
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'translateX(-50%)',
                borderRadius: '4px',
              },
              '&:hover': {
                background: 'transparent',
                opacity: 0.75,
                transform: 'translateY(-1px)',
                '&::after': {
                  width: '32px',
                },
              },
              '&:active': {
                transform: 'translateY(0)',
                opacity: 0.9,
              }
            }}
          >
            Login
          </Button>

          <Button
            onClick={() => navigate('/signup')}
            sx={{
              color,
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
              px: 2,
              py: 0.5,
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              background: 'transparent',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -2,
                left: '50%',
                width: isActive('/signup') ? '32px' : '0%',
                height: '2.5px',
                backgroundColor: color,
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'translateX(-50%)',
                borderRadius: '4px',
              },
              '&:hover': {
                background: 'transparent',
                opacity: 0.75,
                transform: 'translateY(-1px)',
                '&::after': {
                  width: '32px',
                },
              },
              '&:active': {
                transform: 'translateY(0)',
                opacity: 0.9,
              }
            }}
          >
            Sign Up
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default AuthNavbar;
