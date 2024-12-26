import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import mygif from './paintings.webp';

const Mygif1: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        backgroundColor: theme.palette.background.default,
        borderRadius: 2,
        boxShadow: 3,
        mt: 6,
        mb: 4,
      }}
    >
      <Box
        component="img"
        src={mygif}
        alt="Art Shop Animation"
        sx={{
          width: { xs: '100%', md: '50%' },
          height: 'auto',
          borderRadius: 2,
          boxShadow: 1,
          mb: { xs: 4, md: 0 },
        }}
      />
      <Box
        sx={{
          ml: { md: 4 },
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 2,
          }}
        >
                    we have so many intersting things for you

        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.secondary,
            lineHeight: 1.8,
            fontWeight: 400,
          }}
        >
        </Typography>
      </Box>
    </Box>
  );
};

export default Mygif1;
