import React, { useState, useEffect, SyntheticEvent } from 'react';
import { Box, TextField, Button, List, ListItem, Avatar, Typography, Collapse, Snackbar, Alert } from '@mui/material';

interface Comment {
  id: number;
  text: string;
  user: string;
  date: string;
  replies?: Comment[];
}

const CommentBox: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState<string>('');
  const [replyText, setReplyText] = useState<string>('');
  const [showReplies, setShowReplies] = useState<{ [key: number]: boolean }>({});
  const [showReplyInput, setShowReplyInput] = useState<{ [key: number]: boolean }>({});

  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<'success' | 'error' | 'warning'>('success');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch('https://example.com/comments');
        const data: Comment[] = await response.json();
        setComments(data);
      } catch (error) {
        const errorMessage = 'Error fetching comments!';
        setSeverity('error');
        setMessage(errorMessage);
        setOpen(true);
      }
    };
    fetchComments();
  }, []);

  const handleAlertClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'cliclaway') {
      return;
    }
    setOpen(false);
  };

  const handleAddComment = async () => {
    if (comment.trim()) {
      const newComment: Comment = {
        id: Date.now(),
        text: comment,
        user: 'Amin_Janani',
        date: new Date().toLocaleString(),
        replies: [],
      };

      setComments([...comments, newComment]);
      setComment('');

      try {
        await fetch('https://example.com/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newComment),
        });
      } catch (error) {
        const errorMessage = 'Error adding comment!';
        setSeverity('error');
        setMessage(errorMessage);
        setOpen(true);
      }
    }
  };

  const handleAddReply = async (index: number) => {
    if (replyText.trim()) {
      const newReply: Comment = {
        id: Date.now(),
        text: replyText,
        user: 'Amin_Janani',
        date: new Date().toLocaleString(),
      };

      const updatedComments = [...comments];
      updatedComments[index].replies?.push(newReply);
      setComments(updatedComments);
      setReplyText('');
      setShowReplyInput((prev) => ({ ...prev, [index]: false }));

      try {
        await fetch('https://example.com/replies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newReply),
        });  
      } catch (error) {
        const errorMessage = 'Error adding reply!';
        setSeverity('error');
        setMessage(errorMessage);
        setOpen(true);
      }
    }
  };

  const toggleReplies = (index: number) => {
    setShowReplies((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleReplyInput = (index: number) => {
    setShowReplyInput((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
        <Avatar alt="User Avatar" src="/path-to-avatar.jpg" />
        <TextField
          label="Leave a comment ..."
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddComment}>Submit</Button>
      </Box>

      <List>
        {comments.map((c, index) => (
          <Box key={c.id}>
            <ListItem alignItems="flex-start" sx={{ gap: 2 }}>
              <Avatar alt="User Avatar" src="/path-to-avatar.jpg" />
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  {c.user} - <Typography component="span" variant="caption" color="textSecondary">{c.date}</Typography>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: 'pre-line', marginBottom: 1 }}
                >
                  {c.text}
                </Typography>
                <Button size="small" onClick={() => toggleReplyInput(index)}>
                  {showReplyInput[index] ? 'Cancel' : 'Reply'}
                </Button>
                {c.replies && c.replies.length > 0 && (
                  <Button size="small" onClick={() => toggleReplies(index)}>
                    {showReplies[index] ? 'Hide replies' : `Replies (${c.replies.length})`}
                  </Button>
                )}
              </Box>
            </ListItem>

            <Collapse in={showReplyInput[index]} timeout="auto" unmountOnExit>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 8, marginBottom: 2 }}>
                <Avatar alt="User Avatar" src="/path-to-avatar.jpg" />
                <TextField
                  label="Reply a comment ..."
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <Button variant="contained" onClick={() => handleAddReply(index)}>Submit</Button>
              </Box>
            </Collapse>

            <Collapse in={showReplies[index]} timeout="auto" unmountOnExit>
              {c.replies && c.replies.length > 0 && (
                <List sx={{ pl: 4 }}>
                  {c.replies.map((reply) => (
                    <ListItem key={reply.id} alignItems="flex-start" sx={{ gap: 2 }}>
                      <Avatar alt="User Avatar" src="/path-to-avatar.jpg" />
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {reply.user} - <Typography component="span" variant="caption" color="textSecondary">{reply.date}</Typography>
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: 'pre-line' }}
                        >
                          {reply.text}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
            </Collapse>
          </Box>
        ))}
      </List>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleAlertClose} anchorOrigin={{ vertical: "top", horizontal: "center"}}>
          <Alert onClose={handleAlertClose} severity={severity} sx={{width: '235px', height: '90px', textAlign: 'center'}}>
            {message}
          </Alert>
      </Snackbar>
    </Box>
  );
};

export default CommentBox;