import React, { memo } from 'react';
import { Card, CardMedia, Typography, Box, Tooltip, useTheme, IconButton, Zoom } from '@mui/material';
import { IoImageSharp, IoPeopleSharp, IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { PiPaintBrushDuotone } from "react-icons/pi";

interface GalleryProps {
  image_url: string;
  description: string;
  name: string;
  num_paints: number;
  num_artists: number;
  index: number;
}

interface StatBoxProps {
  icon: React.ReactNode;
  value: number;
  title: string;
}

const Gallery: React.FC<GalleryProps> = memo(({ image_url, description, name, num_paints, num_artists, index }) => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const StatBox: React.FC<StatBoxProps> = memo(({ icon, value, title }) => (
    <Tooltip title={title} placement="top" TransitionComponent={Zoom} arrow>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        background: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        borderRadius: '12px',
        py: 0.75,
        px: 1.5,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          background: mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
        }
      }}>
        {icon}
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {value}
        </Typography>
      </Box>
    </Tooltip>
  ));

  return (
    <Card
      sx={{
        width: 345,
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
          '& .gallery-image': {
            transform: 'scale(1.1)',
          },
          '& .gallery-overlay': {
            opacity: 1,
          },
          '& .gallery-content': {
            transform: 'translateY(0)',
            opacity: 1,
          }
        }
      }}
    >
      <Box sx={{ position: 'relative', pt: '100%' }}>
        <CardMedia
          component="img"
          image={image_url}
          alt={name}
          loading="lazy"
          className="gallery-image"
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
          className="gallery-overlay"
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
          className="gallery-content"
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
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            mt: 2 
          }}>
            <StatBox icon={<PiPaintBrushDuotone style={{ fontSize: '14px' }} />} value={num_paints} title="Associated Paintings" />
            <StatBox icon={<IoPeopleSharp style={{ fontSize: '14px' }} />} value={num_artists} title="Associated Artists" />
            
            <Tooltip 
              title="Send Message" 
              placement="top" 
              TransitionComponent={Zoom}
              arrow
            >
              <IconButton
                sx={{
                  ml: 'auto',
                  width: '36px',
                  height: '36px',
                  background: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <IoChatbubbleEllipsesSharp style={{ fontSize: '20px' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Card>
  );
});

export default Gallery;
