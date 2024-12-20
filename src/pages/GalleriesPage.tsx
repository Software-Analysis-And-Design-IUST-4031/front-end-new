import React, { useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const GalleriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default'
    }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Galleries
        </Typography>
        <Typography>
          Coming soon...
        </Typography>
      </Container>
    </Box>
  );
};

export default GalleriesPage;
