import React from 'react';
import { Avatar, Box, Card, CardContent, Typography, IconButton, Chip } from '@mui/material';
import { FavoriteBorder, BookmarkBorder, Share } from '@mui/icons-material';

interface BlogPostProps {
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  preview: string;
  tags: string[];
  image?: string;
}

const BlogPost: React.FC<BlogPostProps> = ({
  title,
  author,
  date,
  readTime,
  preview,
  tags,
  image,
}) => {
  return (
    <Card sx={{ 
      maxWidth: '100%', 
      mb: 4, 
      borderRadius: 2,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
      }
    }}>
      {image && (
        <Box
          sx={{
            height: 240,
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <img
            src={image}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
      )}
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={author.avatar} sx={{ width: 40, height: 40, mr: 2 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {author.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {date} · {readTime} read
            </Typography>
          </Box>
        </Box>

        <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
          {title}
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          {preview}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{
                backgroundColor: 'rgba(0,0,0,0.05)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' },
              }}
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <IconButton size="small">
              <FavoriteBorder />
            </IconButton>
            <IconButton size="small">
              <BookmarkBorder />
            </IconButton>
          </Box>
          <IconButton size="small">
            <Share />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BlogPost;
