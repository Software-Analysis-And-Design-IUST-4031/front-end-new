import React from 'react';
import { Button, Typography, Box, Container, AppBar, Toolbar } from '@mui/material';

const LandingPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            color="primary"
            variant="outlined"
            href="/login"
            sx={{ mr: 2, borderRadius: '20px', textTransform: 'none' }}
          >
            Login
          </Button>
          <Button
            color="secondary"
            variant="contained"
            href="/signup"
            sx={{ borderRadius: '20px', textTransform: 'none' }}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          height: '80vh',
          backgroundImage: 'url("/path-to-your-image.jpg")', // Replace with your image path
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
          textAlign: 'center',
          px: 2,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(to bottom right, rgba(0,0,0,0.5), rgba(0,0,0,0.3))',
            zIndex: 1,
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold', fontSize: { xs: '2rem', md: '3rem' } }}
          >
            Welcome to YourAppName
          </Typography>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 300, fontSize: { xs: '1.2rem', md: '1.5rem' } }}
          >
            Connect. Create. Collaborate.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            href="/signup"
            sx={{
              mt: 4,
              paddingX: 5,
              paddingY: 1.5,
              borderRadius: '50px',
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            Get Started
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LandingPage; 