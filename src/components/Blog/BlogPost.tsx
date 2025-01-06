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
        const [blogData, commentsData] = await Promise.all([
          blogService.getBlog(Number(id)),
          blogService.getComments(Number(id)),
        ]);
        setBlog(blogData);
        setComments(commentsData);
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
      await blogService.addComment(blog.id, { content: newComment });
      setNewComment("");
      // Refresh comments
      const updatedComments = await blogService.getComments(blog.id);
      setComments(updatedComments);
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment. Please try again.");
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
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "100%",
            background: `radial-gradient(circle at 50% 0%, 
              ${alpha(
                theme.palette.mode === "dark" ? "#fff" : "#000",
                0.03
              )} 0%, 
              transparent 70%)`,
            pointerEvents: "none",
          },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => navigate("/blog")}
              sx={{
                bgcolor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.common.white, 0.05)
                    : alpha(theme.palette.common.black, 0.02),
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.common.white, 0.1)
                      : alpha(theme.palette.common.black, 0.05),
                  transform: "translateX(-2px)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            {isAuthor && (
              <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/blog/edit/${id}`)}
                  sx={{
                    borderRadius: "28px",
                    px: 4,
                    py: 1.5,
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? theme.palette.common.white
                        : theme.palette.common.black,
                    color:
                      theme.palette.mode === "dark"
                        ? theme.palette.common.black
                        : theme.palette.common.white,
                    fontSize: "1rem",
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 0 20px rgba(255, 255, 255, 0.1)"
                        : "0 0 20px rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? alpha(theme.palette.common.white, 0.9)
                          : alpha(theme.palette.common.black, 0.8),
                      transform: "translateY(-2px)",
                      boxShadow:
                        theme.palette.mode === "dark"
                          ? "0 0 30px rgba(255, 255, 255, 0.2)"
                          : "0 0 30px rgba(0, 0, 0, 0.2)",
                    },
                    "&:active": {
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  Edit Post
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteClick}
                  sx={{
                    borderRadius: "28px",
                    px: 4,
                    py: 1.5,
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    color: theme.palette.error.main,
                    fontSize: "1rem",
                    fontWeight: 600,
                    textTransform: "none",
                    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                    "&:hover": {
                      bgcolor: theme.palette.error.main,
                      color: theme.palette.common.white,
                      transform: "translateY(-2px)",
                      boxShadow: `0 0 30px ${alpha(
                        theme.palette.error.main,
                        0.2
                      )}`,
                    },
                    "&:active": {
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  Delete
                </Button>
              </Box>
            )}
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 6 },
              borderRadius: "32px",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.common.white, 0.05)
                  : alpha(theme.palette.common.black, 0.02),
              backdropFilter: "blur(20px)",
              border: `1px solid ${
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.common.white, 0.1)
                  : alpha(theme.palette.common.black, 0.05)
              }`,
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "100%",
                background: `radial-gradient(circle at 0% 0%, 
                  ${alpha(
                    theme.palette.mode === "dark" ? "#fff" : "#000",
                    0.03
                  )} 0%, 
                  transparent 50%)`,
                pointerEvents: "none",
              },
            }}
          >
            {blog.image && (
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 300, md: 500 },
                  mb: 4,
                  position: "relative",
                  borderRadius: "24px",
                  overflow: "hidden",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      theme.palette.mode === "dark"
                        ? "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 100%)"
                        : "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 100%)",
                    pointerEvents: "none",
                  },
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

            <Typography
              variant="h2"
              gutterBottom
              sx={{
                fontWeight: 900,
                letterSpacing: -1.5,
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.common.white
                    : theme.palette.common.black,
                fontSize: { xs: "2rem", md: "3rem" },
                lineHeight: 1.2,
                mb: 4,
              }}
            >
              {blog.title}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ mr: 1 }}>
                {blog.author_name[0].toUpperCase()}
              </Avatar>
              <Typography variant="subtitle1" color="text.secondary">
                {blog.author_name} • {formatDate(blog.created_at)}
              </Typography>
            </Box>

            <Typography
              variant="body1"
              component="div"
              sx={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.8,
                fontSize: "1.1rem",
                color:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.common.white, 0.9)
                    : alpha(theme.palette.common.black, 0.9),
                "& p": {
                  mb: 3,
                  "&:last-child": {
                    mb: 0,
                  },
                },
              }}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            <Divider sx={{ my: 6 }} />

            <Box sx={{ mt: 6 }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  letterSpacing: -0.5,
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.common.white
                      : theme.palette.common.black,
                  mb: 4,
                }}
              >
                Comments
              </Typography>

              {username ? (
                <Box sx={{ mb: 4 }}>
                  <form onSubmit={handleCommentSubmit}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "20px",
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? alpha(theme.palette.common.white, 0.05)
                              : alpha(theme.palette.common.black, 0.02),
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? alpha(theme.palette.common.white, 0.08)
                                : alpha(theme.palette.common.black, 0.04),
                            transform: "translateY(-1px)",
                          },
                          "&.Mui-focused": {
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? alpha(theme.palette.common.white, 0.1)
                                : alpha(theme.palette.common.black, 0.05),
                            transform: "translateY(-1px)",
                            boxShadow:
                              theme.palette.mode === "dark"
                                ? "0 0 20px rgba(255, 255, 255, 0.1)"
                                : "0 0 20px rgba(0, 0, 0, 0.1)",
                          },
                          "& fieldset": {
                            borderColor: "transparent",
                          },
                          "&:hover fieldset": {
                            borderColor:
                              theme.palette.mode === "dark"
                                ? alpha(theme.palette.common.white, 0.1)
                                : alpha(theme.palette.common.black, 0.1),
                          },
                          "&.Mui-focused fieldset": {
                            borderColor:
                              theme.palette.mode === "dark"
                                ? alpha(theme.palette.common.white, 0.2)
                                : alpha(theme.palette.common.black, 0.2),
                          },
                        },
                      }}
                    />
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        variant="contained"
                        endIcon={<SendIcon />}
                        type="submit"
                        disabled={!newComment.trim()}
                        sx={{
                          borderRadius: "28px",
                          px: 4,
                          py: 1.5,
                          bgcolor:
                            theme.palette.mode === "dark"
                              ? theme.palette.common.white
                              : theme.palette.common.black,
                          color:
                            theme.palette.mode === "dark"
                              ? theme.palette.common.black
                              : theme.palette.common.white,
                          fontSize: "1rem",
                          fontWeight: 600,
                          textTransform: "none",
                          boxShadow:
                            theme.palette.mode === "dark"
                              ? "0 0 20px rgba(255, 255, 255, 0.1)"
                              : "0 0 20px rgba(0, 0, 0, 0.1)",
                          "&:hover": {
                            bgcolor:
                              theme.palette.mode === "dark"
                                ? alpha(theme.palette.common.white, 0.9)
                                : alpha(theme.palette.common.black, 0.8),
                            transform: "translateY(-2px)",
                            boxShadow:
                              theme.palette.mode === "dark"
                                ? "0 0 30px rgba(255, 255, 255, 0.2)"
                                : "0 0 30px rgba(0, 0, 0, 0.2)",
                          },
                          "&:active": {
                            transform: "translateY(-1px)",
                          },
                          "&.Mui-disabled": {
                            bgcolor:
                              theme.palette.mode === "dark"
                                ? alpha(theme.palette.common.white, 0.1)
                                : alpha(theme.palette.common.black, 0.1),
                            color:
                              theme.palette.mode === "dark"
                                ? alpha(theme.palette.common.white, 0.3)
                                : alpha(theme.palette.common.black, 0.3),
                          },
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      >
                        Post Comment
                      </Button>
                    </Box>
                  </form>
                </Box>
              ) : (
                <Alert severity="info" sx={{ mb: 4, borderRadius: "16px" }}>
                  Please log in to add comments
                </Alert>
              )}

              {comments.map((comment) => (
                <Paper
                  key={comment.id}
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 2,
                    borderRadius: "20px",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.common.white, 0.03)
                        : alpha(theme.palette.common.black, 0.01),
                    border: `1px solid ${
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.common.white, 0.1)
                        : alpha(theme.palette.common.black, 0.05)
                    }`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? alpha(theme.palette.common.white, 0.05)
                          : alpha(theme.palette.common.black, 0.02),
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? alpha(theme.palette.common.white, 0.1)
                            : alpha(theme.palette.common.black, 0.1),
                        width: 32,
                        height: 32,
                      }}
                    >
                      {comment.author.username[0].toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">
                        {comment.author.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(comment.created_at)}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      ml: 7,
                      color:
                        theme.palette.mode === "dark"
                          ? alpha(theme.palette.common.white, 0.9)
                          : alpha(theme.palette.common.black, 0.9),
                    }}
                  >
                    {comment.content}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Paper>
        </Container>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            width: "100%",
            maxWidth: 400,
          },
        }}
      >
        <DialogTitle>Delete Blog Post</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this blog post? This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BlogPost;
