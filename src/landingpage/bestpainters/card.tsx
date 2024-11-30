import React, { memo, useState } from 'react';
import { Card, CardMedia, Typography, Box, Tooltip, useTheme, IconButton, Zoom } from '@mui/material';
import { IoPeopleSharp, IoChatbubbleEllipsesSharp } from "react-icons/io5";

interface PainterCardProps {
  photo: string;
  name: string;
  description: string;
  number_of_paintings: number;
  index: number;
}

const PainterCard: React.FC<PainterCardProps> = memo(({ photo, name, description, number_of_paintings, index }) => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card
      sx={{
        width: 245,
        position: 'relative',
        borderRadius: '24px',
        background: 'transparent',
        backdropFilter: 'blur(12px)',
        overflow: 'hidden',
        border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'}`,
        opacity: 0,
        transform: 'translateY(20px)',
        animation: `fadeSlideIn 0.6s ease-out ${0.2 + index * 0.1}s forwards`,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: mode === 'dark' 
            ? '0 20px 40px -15px rgba(0,0,0,0.5)'
            : '0 20px 40px -15px rgba(0,0,0,0.1)',
          '& .painter-image': {
            transform: 'scale(1.1)',
          },
          '& .painter-overlay': {
            opacity: 1,
          },
          '& .painter-content': {
            transform: 'translateY(0)',
            opacity: 1,
          }
        }
      }}
    >
      <Box sx={{ position: 'relative', pt: '100%' }}>
        <CardMedia
          component="img"
          image={imageError ? 'https://via.placeholder.com/800x600?text=Image+Not+Available' : photo}
          alt={name}
          loading="lazy"
          onError={handleImageError}
          className="painter-image"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
        <Box
          className="painter-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: mode === 'dark'
              ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)'
              : 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 100%)',
            opacity: 0,
            transition: 'opacity 0.4s ease',
          }}
        />
        <Box
          className="painter-content"
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '24px',
            transform: 'translateY(20px)',
            opacity: 0,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: mode === 'dark' ? '#fff' : '#000',
              fontWeight: 600,
              textShadow: mode === 'dark' ? '0 2px 4px rgba(0,0,0,0.5)' : 'none',
            }}
          >
            {name}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              maxHeight: '3em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {description}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <Tooltip 
              title={`Number of Paintings: ${number_of_paintings}`} 
              placement="top" 
              TransitionComponent={Zoom} 
              arrow
            >
              <IconButton>
                <IoPeopleSharp style={{ fontSize: '20px' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Card>
  );
});

export default PainterCard;
