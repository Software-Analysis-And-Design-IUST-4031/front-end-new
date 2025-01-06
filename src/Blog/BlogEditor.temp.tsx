import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BlogEditor: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    if (!content.trim()) {
      alert('Content is required');
      return;
    }
    // TODO: Submit the question to your backend
    console.log({ title, content });
    navigate('/blog');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Ask a Question
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Title
          </Typography>
          <TextField
            fullWidth
            placeholder="e.g. How to implement JWT authentication in React?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Question Details
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={10}
            placeholder="Write your question details here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: '#ffffff',
              }
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => navigate('/blog')}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              bgcolor: '#0a95ff',
              '&:hover': { bgcolor: '#0074cc' },
              color: 'white',
            }}
          >
            Post Your Question
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default BlogEditor;
