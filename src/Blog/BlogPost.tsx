import React, { useState } from 'react';
import { 
  Avatar, 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  Chip,
  TextField,
  Button,
  Divider,
  Paper,
  Rating,
  useTheme,
} from '@mui/material';
import { 
  FavoriteBorder, 
  Favorite,
  BookmarkBorder, 
  Share,
  ThumbUp,
  ThumbDown,
  Send,
} from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  date: string;
  likes: number;
  userLiked?: boolean;
}

interface BlogPostProps {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  content: string;
  preview: string;
  tags: string[];
  image?: string;
  likes: number;
  userLiked?: boolean;
  rating: number;
  userRating?: number;
  comments: Comment[];
}

const BlogPost: React.FC<BlogPostProps> = ({
  id,
  title,
  author,
  date,
  readTime,
  content,
  preview,
  tags,
  image,
  likes,
  userLiked = false,
  rating,
  userRating = 0,
  comments: initialComments,
}) => {
  const theme = useTheme();
  const [isLiked, setIsLiked] = useState(userLiked);
  const [likesCount, setLikesCount] = useState(likes);
  const [userRatingValue, setUserRatingValue] = useState(userRating);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    // TODO: API call to update like status
  };

  const handleRating = (newValue: number | null) => {
    if (newValue !== null) {
      setUserRatingValue(newValue);
      // TODO: API call to update rating
    }
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      author: {
        name: 'Current User', // TODO: Get from auth context
        avatar: 'https://i.pravatar.cc/150?img=1', // TODO: Get from auth context
      },
      content: newComment,
      date: new Date().toLocaleDateString(),
      likes: 0,
    };

    setComments([...comments, newCommentObj]);
    setNewComment('');
    // TODO: API call to save comment
  };

  const handleCommentLike = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        const newLikeStatus = !comment.userLiked;
        return {
          ...comment,
          likes: newLikeStatus ? comment.likes + 1 : comment.likes - 1,
          userLiked: newLikeStatus,
        };
      }
      return comment;
    }));
    // TODO: API call to update comment like
  };

  return (
    <Card sx={{ 
      maxWidth: '800px',
      margin: '0 auto',
      mb: 4, 
      borderRadius: 2,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}>
      {image && (
        <Box
          sx={{
            height: 400,
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

        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          {title}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
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

        <Typography variant="body1" paragraph>
          {content}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={handleLike}>
              {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
            <Typography>{likesCount}</Typography>
            <Rating
              value={userRatingValue}
              onChange={(_, newValue) => handleRating(newValue)}
              size="large"
            />
          </Box>
          <IconButton>
            <Share />
          </IconButton>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Comments Section */}
        <Typography variant="h6" gutterBottom>
          Comments ({comments.length})
        </Typography>

        <Box sx={{ mb: 4 }}>
          <ReactQuill
            value={newComment}
            onChange={setNewComment}
            placeholder="Write a comment..."
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link'],
                ['clean']
              ],
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              endIcon={<Send />}
              onClick={handleCommentSubmit}
              disabled={!newComment.trim()}
            >
              Post Comment
            </Button>
          </Box>
        </Box>

        {/* Comments List */}
        <Box sx={{ mt: 4 }}>
          {comments.map((comment) => (
            <Paper
              key={comment.id}
              elevation={0}
              sx={{
                p: 2,
                mb: 2,
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Avatar src={comment.author.avatar} />
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {comment.author.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {comment.date}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    dangerouslySetInnerHTML={{ __html: comment.content }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleCommentLike(comment.id)}
                    >
                      {comment.userLiked ? <ThumbUp color="primary" /> : <ThumbUp />}
                    </IconButton>
                    <Typography variant="caption" sx={{ ml: 1 }}>
                      {comment.likes}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default BlogPost;
