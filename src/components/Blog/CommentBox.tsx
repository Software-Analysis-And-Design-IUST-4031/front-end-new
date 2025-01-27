import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Avatar,
  Paper,
  Typography,
  Stack,
  Alert
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { Comment, CommentCreateData } from '../../services/blogService';
import { useAuth } from '../../context/AuthContext';

interface CommentBoxProps {
  blogId: number;
  comments: Comment[];
  onCommentSubmit: (commentData: CommentCreateData) => Promise<void>;
}

const CommentBox: React.FC<CommentBoxProps> = ({ blogId, comments, onCommentSubmit }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { username } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await onCommentSubmit({ content: newComment });
      setNewComment('');
    } catch (err) {
      setError('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Comments ({comments.length})
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {username ? (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!newComment.trim() || isSubmitting}
            endIcon={<SendIcon />}
          >
            Post Comment
          </Button>
        </Box>
      ) : (
        <Alert severity="info" sx={{ mb: 4 }}>
          Please log in to add comments
        </Alert>
      )}

      <Box
        sx={{
          maxHeight: '400px',
          overflowY: 'auto',
          px: 1,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      >
        <Stack spacing={2}>
          {comments.map((comment) => (
            <Paper 
              key={comment.id} 
              sx={{ 
                p: 2,
                '&:hover': {
                  boxShadow: 2,
                },
                transition: 'box-shadow 0.2s',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                  {comment.author_name[0].toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {comment.author_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(comment.created_at)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ pl: 7 }}>
                {comment.content}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default CommentBox;