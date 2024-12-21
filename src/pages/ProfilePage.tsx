import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { BackendPainting } from '../types';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, userProfile, userId } = useAuth();
  const [paintings, setPaintings] = useState<BackendPainting[]>([]);
  const [likes, setLikes] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      
      setIsLoadingData(true);
      setError(null);
      
      try {
        const paintingsData = await userService.getUserPaintings(userId);
        setPaintings(paintingsData.paintings);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load some user data. Please try again later.');
      } finally {
        setIsLoadingData(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (isLoading || isLoadingData) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default'
    }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Typography variant="h4" component="h1" gutterBottom>
          {userProfile?.firstname ? `Welcome, ${userProfile.firstname}!` : 'Profile'}
        </Typography>
        
        {userProfile ? (
          <Box>
            <Typography variant="body1" gutterBottom>
              Username: {userProfile.username}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Email: {userProfile.email}
            </Typography>
            {userProfile.biography && (
              <Typography variant="body1" gutterBottom>
                Biography: {userProfile.biography}
              </Typography>
            )}
            
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
              Your Paintings ({paintings.length})
            </Typography>
            {paintings.length > 0 ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
                {paintings.map(painting => (
                  <Box key={painting.painting_id} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle1">{painting.title}</Typography>
                    <Typography variant="body2">{painting.description}</Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">No paintings yet</Typography>
            )}
          </Box>
        ) : (
          <Typography>Loading profile information...</Typography>
        )}
      </Container>
    </Box>
  );
};

export default ProfilePage;
