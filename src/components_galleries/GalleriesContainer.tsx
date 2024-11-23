import React, { memo, Suspense, lazy } from 'react';
import { Box, Grid, Container, IconButton, Typography, useTheme, CircularProgress } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useColorMode } from '../App';
import '../Themes.css';

const Gallery = lazy(() => import('./gallery'));

const galleryData = [
  {
    image_url: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&w=800&q=75",
    description: "A beautiful collection of contemporary art featuring works from emerging artists around the world. This gallery showcases diverse perspectives and innovative techniques in modern art.",
    name: "Contemporary Collection",
    num_paints: 45,
    num_artists: 12
  },
  {
    image_url: "https://images.unsplash.com/photo-1577720580479-7d839d829c73?auto=format&w=800&q=75",
    description: "Classical masterpieces from the Renaissance period, showcasing the timeless beauty of traditional art techniques and storytelling through visual media.",
    name: "Renaissance Gallery",
    num_paints: 32,
    num_artists: 8
  },
  {
    image_url: "https://images.unsplash.com/photo-1574182245530-967d9b3831af?auto=format&w=800&q=75",
    description: "Modern abstract expressions that challenge conventional art forms. This collection represents the cutting edge of contemporary artistic innovation.",
    name: "Modern Abstract",
    num_paints: 28,
    num_artists: 15
  }
];

// Memoize the theme toggle button to prevent unnecessary re-renders
const ThemeToggle = memo(({ mode, toggleColorMode }: { mode: string, toggleColorMode: () => void }) => (
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
));

const LoadingFallback = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      width: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      background: 'rgba(0,0,0,0.1)',
      backdropFilter: 'blur(8px)',
      zIndex: 1200,
    }}
  >
    <CircularProgress />
  </Box>
);

const GalleriesContainer: React.FC = () => {
  const theme = useTheme();
  const { toggleColorMode, mode } = useColorMode();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.background.default,
        backgroundImage: mode === 'dark' 
          ? 'radial-gradient(circle at 50% 50%, rgba(37, 38, 43, 0.87) 0%, rgba(18, 18, 23, 0.95) 100%)'
          : 'radial-gradient(circle at 50% 50%, rgba(250, 250, 252, 0.87) 0%, rgba(246, 246, 248, 0.95) 100%)',
        borderRadius: '32px 32px 0 0',
        margin: '0 auto',
        maxWidth: '1200px',
        width: '100%',
        border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)'}`,
        boxShadow: mode === 'dark' 
          ? '0 25px 70px -15px rgba(0,0,0,0.7)'
          : '0 25px 70px -15px rgba(0,0,0,0.25)',
      }}
    >
      <ThemeToggle mode={mode} toggleColorMode={toggleColorMode} />
      
      <Container maxWidth="xl" sx={{ pt: 8, pb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6, p: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              mb: 2,
              color: theme.palette.text.primary,
              fontWeight: 700,
              letterSpacing: '-0.5px',
              opacity: 0,
              animation: 'fadeIn 0.8s ease-out forwards',
            }}
          >
            Art Galleries
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: theme.palette.text.secondary,
              maxWidth: '800px',
              margin: '0 auto',
              fontWeight: 400,
              opacity: 0,
              animation: 'fadeIn 0.8s ease-out 0.2s forwards',
            }}
          >
            Explore our curated collection of exceptional artworks from talented artists around the world
          </Typography>
        </Box>

        <Grid 
          container 
          spacing={4} 
          justifyContent="center"
        >
          <Suspense fallback={<LoadingFallback />}>
            {galleryData.map((gallery, index) => (
              <Grid 
                item 
                key={index}
              >
                <Gallery
                  {...gallery}
                  index={index}
                />
              </Grid>
            ))}
          </Suspense>
        </Grid>
      </Container>
    </Box>
  );
};

export default memo(GalleriesContainer);
