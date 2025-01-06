import React from 'react';
import { Box, Typography, Stack, useTheme } from '@mui/material';

const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        backgroundColor: theme.palette.background.paper,
        boxShadow: 1,
        mt: 6,
      }}
    >
      <Stack
        direction="row"
        spacing={25} // Adjust this value to increase or decrease the spacing
        justifyContent="center"
        alignItems="center"
      >
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
          }}
        >
          Contact us: info@zaferuni.com
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
          }}
        >
          <a
            href="https://zaferuni.liara.run/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: theme.palette.text.secondary }}
          >
            https://zaferuni.liara.run/
          </a>
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
          }}
        >
          Instagram: zaferuni
        </Typography>
      </Stack>
    </Box>
  );
};

export default Footer;
