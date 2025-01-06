import React from 'react';
import { Grid, Box, Typography, Container, useTheme } from '@mui/material';
import paintingAnimation from './paintings2.webp';

const Title: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        py: 8,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
        borderRadius: 2,
        mt: 6,
        mb: 20,
      }}
      
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4}
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #0D47A1 30%, #1976D2 90%)' : 'linear-gradient(45deg, #0D47A1 30%, #1976D2 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Explore Our Paintings and Shops
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <img
                src={paintingAnimation}
                alt="Animated display of paintings for Art Shop"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: theme.shape.borderRadius,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Title;
