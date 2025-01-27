import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Avatar,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import blogService, { Blog, Comment } from "../../services/blogService";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../Navbar";
import { styled } from "@mui/material/styles";
import { Theme } from "@mui/material/styles";

const BlogPost: React.FC = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { username } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchBlogAndComments = async () => {
      try {
        setLoading(true);
        const blogData = await blogService.getBlog(Number(id));
        setBlog(blogData);
        setComments(blogData.comments || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogAndComments();
    }
  }, [id]);

  const handleBack = () => {
    navigate("/blog");
  };

  const handleEdit = () => {
    navigate(`/blog/edit/${id}`);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await blogService.deleteBlog(Number(id));
      navigate("/blog");
    } catch (err) {
      console.error("Error deleting blog:", err);
      setError("Failed to delete blog post. Please try again later.");
    }
    setDeleteDialogOpen(false);
  };

  const handleCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newComment.trim() || !blog) return;

    try {
      setLoading(true);
      const commentData = {
        content: newComment,
        blog: blog.id,
      };

      // Add the comment
      const newCommentData = await blogService.addComment(blog.id, commentData);
      console.log("New comment added:", newCommentData);

      // Clear the input and error state
      setNewComment("");
      setError(null);

      // Fetch the updated blog data to get the latest comments
      const updatedBlog = await blogService.getBlog(blog.id);
      setBlog(updatedBlog);
      setComments(updatedBlog.comments || []);
    } catch (error: any) {
      console.error("Error adding comment:", error);
      setError(
        error.response?.data?.message ||
          "Failed to add comment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const CommentSection = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(4),
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "inherit",
  }));

  const CommentCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    background: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    "& a": {
      color: theme.palette.mode === "dark" ? "#FFFFFF" : "inherit",
    },
  }));

  const CommentHeader = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
    gap: theme.spacing(2),
  }));

  const CommentContent = styled(Typography)(({ theme }) => ({
    color:
      theme.palette.mode === "dark" ? "#FFFFFF" : theme.palette.text.primary,
    fontSize: "1rem",
    lineHeight: 1.6,
  }));

  const CommentMeta = styled(Typography)(({ theme }) => ({
    color:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.7)"
        : theme.palette.text.secondary,
    fontSize: "0.875rem",
  }));

  if (loading) {
    return (
      <>
        <Navbar />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="calc(100vh - 64px)"
        >
          <CircularProgress size={40} />
        </Box>
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error || "Blog post not found"}
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mt: 2 }}
          >
            Back to Blogs
          </Button>
        </Container>
      </>
    );
  }

  const isAuthor = username === blog.author_name;

  return (
    <>
      <Navbar />
      <Box
        sx={{
          background:
            theme.palette.mode === "dark"
              ? `linear-gradient(180deg, 
                ${alpha(theme.palette.common.black, 0.4)} 0%,
                ${alpha(theme.palette.common.black, 0.2)} 50%,
                transparent 100%)`
              : `linear-gradient(180deg, 
                ${alpha(theme.palette.common.black, 0.05)} 0%,
                ${alpha(theme.palette.common.black, 0.02)} 50%,
                transparent 100%)`,
          pt: 8,
          pb: 6,
          position: "relative",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={handleBack}
              sx={{
                bgcolor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.common.white, 0.05)
                    : alpha(theme.palette.common.black, 0.02),
                color: theme.palette.mode === "dark" ? "#FFFFFF" : "inherit",
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            {isAuthor && (
              <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
                <Button
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                  sx={{
                    borderRadius: "28px",
                    px: 4,
                    py: 1.5,
                    bgcolor:
                      theme.palette.mode === "dark" ? "#ffffff" : "#000000",
                    color:
                      theme.palette.mode === "dark" ? "#000000" : "#ffffff",
                    "&:hover": {
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? alpha("#ffffff", 0.9)
                          : alpha("#000000", 0.8),
                    },
                  }}
                >
                  Edit Post
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteClick}
                  color="error"
                  sx={{ borderRadius: "28px", px: 4, py: 1.5 }}
                >
                  Delete
                </Button>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 2,
            bgcolor: "background.paper",
            border: `1px solid ${theme.palette.divider}`,
            color: theme.palette.mode === "dark" ? "#FFFFFF" : "inherit",
          }}
        >
          {/* Blog Content */}
          <Box>
            <Typography
              variant="h3"
              gutterBottom
              fontWeight={800}
              sx={{
                color: theme.palette.mode === "dark" ? "#FFFFFF" : "inherit",
              }}
            >
              {blog.title}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                mb: 4,
                color:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.7)"
                    : theme.palette.text.secondary,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersonIcon />
                <Typography>{blog.author_name}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarIcon />
                <Typography>{formatDate(blog.created_at)}</Typography>
              </Box>
            </Box>
            {blog.image && (
              <Box
                sx={{
                  width: "100%",
                  height: 400,
                  borderRadius: 2,
                  overflow: "hidden",
                  mb: 4,
                }}
              >
                <img
                  src={blog.image}
                  alt={blog.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            )}
            <Box
              dangerouslySetInnerHTML={{ __html: blog.content }}
              sx={{
                "& p": { mb: 2, lineHeight: 1.8 },
                "& img": {
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: 1,
                },
              }}
            />
          </Box>

          {/* Comments Section */}
          <Box sx={{ mt: 6 }}>
            <Typography
              variant="h5"
              gutterBottom
              fontWeight={600}
              sx={{
                color: theme.palette.mode === "dark" ? "#FFFFFF" : "inherit",
              }}
            >
              Comments ({comments.length})
            </Typography>

            {/* Add Comment Form */}
            <Box
              component="form"
              onSubmit={handleCommentSubmit}
              sx={{ mb: 4, mt: 3 }}
            >
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    color:
                      theme.palette.mode === "dark" ? "#FFFFFF" : "inherit",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.23)"
                        : "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.4)"
                        : "rgba(0, 0, 0, 0.4)",
                  },
                  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
                  },
                }}
                InputProps={{
                  sx: {
                    color:
                      theme.palette.mode === "dark" ? "#FFFFFF" : "inherit",
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={!newComment.trim() || loading}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <SendIcon />
                }
                sx={{
                  borderRadius: 28,
                  px: 3,
                  py: 1,
                  bgcolor:
                    theme.palette.mode === "dark" ? "#ffffff" : "#000000",
                  color: theme.palette.mode === "dark" ? "#000000" : "#ffffff",
                  "&:hover": {
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? alpha("#ffffff", 0.9)
                        : alpha("#000000", 0.8),
                  },
                }}
              >
                {loading ? "Posting..." : "Post Comment"}
              </Button>
            </Box>

            {/* Comments List */}
            <CommentSection>
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <CommentCard key={comment.id} elevation={0}>
                    <CommentHeader>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor:
                            theme.palette.mode === "dark"
                              ? "primary.dark"
                              : "primary.main",
                        }}
                      >
                        {comment.author_name?.[0]?.toUpperCase() || "?"}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          sx={{
                            color:
                              theme.palette.mode === "dark"
                                ? "#FFFFFF"
                                : "inherit",
                          }}
                        >
                          {comment.author_name || "Anonymous"}
                        </Typography>
                        <CommentMeta>
                          {formatDate(comment.created_at)}
                        </CommentMeta>
                      </Box>
                    </CommentHeader>
                    <CommentContent>{comment.content}</CommentContent>
                  </CommentCard>
                ))
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography
                    sx={{
                      color:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.7)"
                          : theme.palette.text.secondary,
                    }}
                  >
                    No comments yet. Be the first to comment!
                  </Typography>
                </Box>
              )}
            </CommentSection>
          </Box>
        </Paper>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Blog Post</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this blog post? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BlogPost;
