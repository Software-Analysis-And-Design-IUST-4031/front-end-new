import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  useTheme,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Fade,
  Divider,
  alpha,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon,
  Bookmark as BookmarkIcon,
  Comment as CommentIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import blogService, { Blog } from "../../services/blogService";
import Navbar from "../Navbar";
import SideBar from "../UserPanel/SideBar";
import { useAuth } from "../../context/AuthContext";
import { styled } from "@mui/material/styles";
import { Theme } from "@mui/material";

const HeroSection = styled(Box)(({ theme }) => ({
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)"
      : "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
  padding: theme.spacing(12, 0, 8),
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    background: `radial-gradient(circle at 50% 50%, 
      ${alpha(theme.palette.mode === "dark" ? "#ffffff" : "#000000", 0.03)} 0%, 
      transparent 70%)`,
    pointerEvents: "none",
  },
}));

const SearchSection = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  padding: theme.spacing(3),
  position: "sticky",
  top: 0,
  zIndex: 10,
  borderBottom: `1px solid ${theme.palette.divider}`,
  backdropFilter: "blur(8px)",
}));

const BlogCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  background: theme.palette.background.paper,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  border: `1px solid ${theme.palette.divider}`,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "4px",
    height: "100%",
    background: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
    "&::before": {
      opacity: 0.2,
    },
    "& .blog-title": {
      color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
    },
    "& .blog-image": {
      transform: "scale(1.05)",
    },
  },
}));

const BlogHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const BlogContent = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(4),
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

const BlogText = styled(Box)(({ theme }) => ({
  flex: 1,
}));

const BlogImage = styled(Box)(({ theme }) => ({
  width: "280px",
  height: "200px",
  borderRadius: theme.shape.borderRadius * 2,
  overflow: "hidden",
  flexShrink: 0,
  boxShadow: theme.shadows[2],
  border: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down("md")]: {
    width: "100%",
    height: "240px",
    marginBottom: theme.spacing(3),
  },
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.6s ease",
  },
}));

const BlogTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.75rem",
  fontWeight: 800,
  lineHeight: 1.3,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
  transition: "color 0.2s ease",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-8px",
    left: 0,
    width: "40px",
    height: "2px",
    background: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
    opacity: 0.2,
  },
}));

const BlogExcerpt = styled(Typography)(({ theme }) => ({
  color:
    theme.palette.mode === "dark" ? "#ffffff" : theme.palette.text.secondary,
  fontSize: "1.1rem",
  lineHeight: 1.6,
  marginBottom: theme.spacing(3),
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
}));

const BlogMeta = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(3),
  color: theme.palette.text.secondary,
  fontSize: "0.9rem",
  "& .MuiSvgIcon-root": {
    fontSize: "1.1rem",
  },
}));

const BlogTags = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const BlogTag = styled(Chip)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.grey[800], 0.5)
      : alpha(theme.palette.grey[200], 0.8),
  color: theme.palette.text.primary,
  fontWeight: 500,
  border: `1px solid ${theme.palette.divider}`,
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? alpha(theme.palette.grey[700], 0.7)
        : alpha(theme.palette.grey[300], 0.9),
    transform: "translateY(-1px)",
  },
}));

const BlogPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { username, userProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filter, setFilter] = useState("all");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await blogService.getBlogs();
        setBlogs(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value as string);
  };

  const handleFilterChange = (event: any) => {
    setFilter(event.target.value as string);
  };

  const handleCreatePost = () => {
    navigate("/blog/create");
  };

  const handleViewBlog = (blogId: number) => {
    navigate(`/blog/${blogId}`);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  const filteredAndSortedBlogs = blogs
    .filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase());

      if (filter === "all") return matchesSearch;
      if (filter === "my" && username) {
        return matchesSearch && blog.author_name === username;
      }
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (sortBy === "oldest") {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
      return 0;
    });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <>
      <Navbar onSidebarToggle={handleSidebarToggle} />
      {userProfile && (
        <SideBar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          userData={userProfile}
          onProfileUpdate={() => {}}
        />
      )}
      <HeroSection>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              fontWeight: 900,
              mb: 3,
              color: theme.palette.mode === "dark" ? "#ffffff" : "inherit",
            }}
          >
            Explore Our Blog
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 6 }}>
            Discover stories, thinking, and expertise from writers on any topic.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleCreatePost}
            sx={{
              borderRadius: "28px",
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              textTransform: "none",
              bgcolor: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
              color: theme.palette.mode === "dark" ? "#000000" : "#ffffff",
              "&:hover": {
                bgcolor:
                  theme.palette.mode === "dark"
                    ? alpha("#ffffff", 0.9)
                    : alpha("#000000", 0.8),
              },
            }}
          >
            Write a Story
          </Button>
        </Container>
      </HeroSection>

      <SearchSection>
        <Container maxWidth="md">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search stories..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "28px",
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? alpha("#ffffff", 0.05)
                        : alpha("#000000", 0.03),
                    "&:hover": {
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? alpha("#ffffff", 0.08)
                          : alpha("#000000", 0.05),
                    },
                    "& fieldset": {
                      borderColor:
                        theme.palette.mode === "dark"
                          ? alpha("#ffffff", 0.1)
                          : alpha("#000000", 0.1),
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  displayEmpty
                  sx={{
                    borderRadius: "28px",
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? alpha("#ffffff", 0.05)
                        : alpha("#000000", 0.03),
                    "& fieldset": {
                      borderColor:
                        theme.palette.mode === "dark"
                          ? alpha("#ffffff", 0.1)
                          : alpha("#000000", 0.1),
                    },
                  }}
                >
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="oldest">Oldest First</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <Select
                  value={filter}
                  onChange={handleFilterChange}
                  displayEmpty
                  sx={{
                    borderRadius: "28px",
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? alpha("#ffffff", 0.05)
                        : alpha("#000000", 0.03),
                    "& fieldset": {
                      borderColor:
                        theme.palette.mode === "dark"
                          ? alpha("#ffffff", 0.1)
                          : alpha("#000000", 0.1),
                    },
                  }}
                >
                  <MenuItem value="all">All Stories</MenuItem>
                  {username && <MenuItem value="my">My Stories</MenuItem>}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Container>
      </SearchSection>

      <Container maxWidth="md" sx={{ py: 6 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress
              sx={{
                color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
              }}
            />
          </Box>
        ) : error ? (
          <Alert
            severity="error"
            sx={{
              mb: 4,
              borderRadius: 2,
              bgcolor:
                theme.palette.mode === "dark"
                  ? alpha("#ff3333", 0.1)
                  : alpha("#ff3333", 0.05),
              color: "#ff3333",
              "& .MuiAlert-icon": {
                color: "#ff3333",
              },
            }}
          >
            {error}
          </Alert>
        ) : (
          <Box>
            {filteredAndSortedBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                onClick={() => handleViewBlog(blog.id)}
                elevation={0}
                sx={{
                  "&:hover": {
                    borderColor:
                      theme.palette.mode === "dark"
                        ? alpha("#ffffff", 0.2)
                        : alpha("#000000", 0.2),
                    "& .blog-title": {
                      color:
                        theme.palette.mode === "dark" ? "#ffffff" : "#000000",
                    },
                  },
                }}
              >
                <BlogHeader>
                  <Avatar sx={{ width: 48, height: 48 }}>
                    {blog.author_name?.[0].toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{
                        color:
                          theme.palette.mode === "dark"
                            ? "#ffffff"
                            : theme.palette.text.primary,
                      }}
                    >
                      {blog.author_name || "Unknown Author"}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.7)"
                            : theme.palette.text.secondary,
                      }}
                    >
                      {formatDate(blog.created_at)}
                    </Typography>
                  </Box>
                </BlogHeader>

                <BlogContent>
                  <BlogText>
                    <BlogTitle className="blog-title">{blog.title}</BlogTitle>
                    <BlogExcerpt>
                      {truncateText(
                        blog.content.replace(/<\/?[^>]+(>|$)/g, " "),
                        200
                      )}
                    </BlogExcerpt>
                    <BlogMeta>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CalendarIcon
                          sx={{
                            color:
                              theme.palette.mode === "dark"
                                ? "#ffffff"
                                : "inherit",
                          }}
                        />
                        <Typography
                          sx={{
                            color:
                              theme.palette.mode === "dark"
                                ? "#ffffff"
                                : theme.palette.text.secondary,
                          }}
                        >
                          {formatDate(blog.created_at)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <PersonIcon
                          sx={{
                            color:
                              theme.palette.mode === "dark"
                                ? "#ffffff"
                                : "inherit",
                          }}
                        />
                        <Typography
                          sx={{
                            color:
                              theme.palette.mode === "dark"
                                ? "#ffffff"
                                : theme.palette.text.secondary,
                          }}
                        >
                          {blog.author_name}
                        </Typography>
                      </Box>
                    </BlogMeta>
                    {blog.tags && blog.tags.length > 0 && (
                      <BlogTags>
                        {blog.tags.map((tag: string, index: number) => (
                          <BlogTag key={index} label={tag} size="small" />
                        ))}
                      </BlogTags>
                    )}
                  </BlogText>
                  {blog.image && (
                    <BlogImage>
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="blog-image"
                      />
                    </BlogImage>
                  )}
                </BlogContent>
              </BlogCard>
            ))}

            {filteredAndSortedBlogs.length === 0 && (
              <Box textAlign="center" py={8}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No stories found
                </Typography>
                <Typography color="text.secondary">
                  Try adjusting your search or filter to find what you're
                  looking for.
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Container>
    </>
  );
};

export default BlogPage;
