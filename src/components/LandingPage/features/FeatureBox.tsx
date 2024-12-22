import React, { useEffect, useState, useRef } from 'react';
import { Paper, Typography, Box, useTheme } from '@mui/material';
import { Fade } from '@mui/material';

interface FeatureBoxProps {
  title: string;
  description: string;
}

const FeatureBox: React.FC<FeatureBoxProps> = ({ title, description }) => {
  const [isInView, setIsInView] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (boxRef.current) {
      observer.observe(boxRef.current);
    }

    return () => {
      if (boxRef.current) {
        observer.unobserve(boxRef.current);
      }
    };
  }, []);

  return (
    <Fade in={isInView} timeout={1000}>
      <Paper
        ref={boxRef}
        elevation={3}
        sx={{
          p: 3,
          height: '100%',
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : '#ffffff',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 8px 24px rgba(255, 255, 255, 0.1)'
              : '0 8px 24px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Typography
          variant="h5"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: theme.palette.mode === 'dark' ? '#fff' : '#1a1a1a',
            mb: 2,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#666666',
            lineHeight: 1.7,
          }}
        >
          {description}
        </Typography>
      </Paper>
    </Fade>
  );
};

export default FeatureBox;
