import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Avatar,
  Paper,
  useTheme,
} from '@mui/material';
import { Comment } from '../../services/blogService';

interface CommentBoxProps {
  comments: Comment[];
  onSubmitComment: (content: string, parentId?: number) => void;
  currentUser: string;
  replyingTo: number | null;
  onCancelReply: () => void;
}

const CommentBox: React.FC<CommentBoxProps> = ({
  onSubmitComment,
  currentUser,
  replyingTo,
  onCancelReply
}) => {
  const theme = useTheme();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      onSubmitComment(newComment, replyingTo || undefined);
      setNewComment('');
      if (replyingTo) {
        onCancelReply();
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2,
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(255,255,255,0.05)' 
          : 'rgba(0,0,0,0.02)',
        borderRadius: 2,
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {currentUser[0].toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mb: 2 }}
              variant="outlined"
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              {replyingTo && (
                <Button
                  onClick={onCancelReply}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                disabled={!newComment.trim() || isSubmitting}
              >
                {isSubmitting ? 'Posting...' : replyingTo ? 'Post Reply' : 'Post Comment'}
              </Button>
            </Box>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

export default CommentBox;