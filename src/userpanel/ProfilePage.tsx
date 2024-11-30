import React, { useState, useMemo, useEffect } from 'react';
import {
  Container,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  styled,
  useTheme,
  Fade,
  Tooltip,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import UploadDialog from './UploadDialog';
import ProfileHeader from './ProfileHeader';
import PostGrid from './PostGrid';
import ThemeSelector from './ThemeSelector';
import AddIcon from '@mui/icons-material/Add';
import PaletteIcon from '@mui/icons-material/Palette';
import SortIcon from '@mui/icons-material/Sort';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import TurnedInNotOutlinedIcon from '@mui/icons-material/TurnedInNotOutlined';
import { useColorMode } from '../App';
import { useLocalStorage } from '../hooks/useLocalStorage';
import SideBar from '../ProfileSideBar/SideBar';

interface Post {
  id: string;
  imageUrl: string;
  caption: string;
  title: string;
  price: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
}

interface User {
  id: string;
  fullName: string;
  username: string;
  avatarUrl: string;
  description?: string;
  location?: string;
  followers: number;
  following: number;
  bio: string;
  socialLinks?: {
    twitter?: string;
    pinterest?: string;
  };
}

interface CustomTheme {
  bg: string;
  text: string;
}

interface CustomThemeProps {
  customBg?: string;
  customText?: string;
}

const StyledContainer = styled(Box)<CustomThemeProps>(({ theme, customBg }) => ({
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  paddingTop: theme.spacing(3),
  minHeight: '100vh',
  backgroundColor: customBg,
  transition: 'background-color 0.3s ease',
  borderRadius: theme.shape.borderRadius * 4,
  margin: '0 auto', // Center horizontally
  maxWidth: '1200px', // Set maximum width
  width: '100%',
  '@media (max-width: 1200px)': {
    width: '100%',
    padding: theme.spacing(3),
  },
}));

const StyledCardContent = styled(Box)<CustomThemeProps>(({ theme, customBg, customText }) => ({
  backgroundColor: customBg,
  color: customText,
  borderRadius: 24,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  boxShadow: 'none',
  border: 'none',
}));

const UploadButton = styled(IconButton)<CustomThemeProps>(({ theme, customBg, customText }) => ({
  position: 'fixed',
  right: 20,
  bottom: 20,
  backgroundColor: customText,
  color: customBg,
  width: 56,
  height: 56,
  boxShadow: `0 8px 32px ${customText}25`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: customText,
    transform: 'translateY(-5px) rotate(90deg) scale(1.02)',
    boxShadow: `0 12px 40px ${customText}35`,
  },
  '&:active': {
    transform: 'translateY(0) scale(0.98)',
    boxShadow: `0 6px 20px ${customText}20`,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 26,
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
}));

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const [customTheme, setCustomTheme] = useState<CustomTheme>({
    bg: mode === 'light' ? '#F7F8FA' : '#1E1E1E',
    text: mode === 'light' ? '#333333' : '#FFFFFF'
  });
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [themeSelectorOpen, setThemeSelectorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  // ********************localStorage*************************
  const [userData, setUserData] = useLocalStorage<User>('userData', {
    id: '1',
    fullName: 'John Doe',
    username: 'johndoe',
    avatarUrl: 'https://via.placeholder.com/150',
    description: 'Digital artist and creator',
    location: 'San Francisco, CA',
    followers: 1234,
    following: 567,
    bio: 'Digital artist and creator',
    socialLinks: {
      twitter: 'https://twitter.com/johndoe',
      pinterest: 'https://pinterest.com/johndoe'
    }
  });

  const [uploadedPosts, setUploadedPosts] = useLocalStorage<Post[]>('uploadedPosts', [
    {
      id: '1',
      imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0XFyAeIRshGxsdIR0hHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
      caption: 'Abstract art piece exploring color and form',
      title: 'Chromatic Dreams',
      price: '$299.99',
      likes: 15,
      isLiked: false,
      isSaved: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '2',
      imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0XFyAeIRshGxsdIR0hHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
      caption: 'Digital artwork exploring modern themes',
      title: 'Digital Horizons',
      price: '$199.99',
      likes: 8,
      isLiked: true,
      isSaved: true,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: '3',
      imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0XFyAeIRshGxsdIR0hHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
      caption: 'Contemporary sculpture in mixed media',
      title: 'Urban Flow',
      price: '$449.99',
      likes: 23,
      isLiked: false,
      isSaved: false,
      createdAt: new Date(Date.now() - 259200000).toISOString(),
    }
  ]);
  const [savedPosts, setSavedPosts] = useLocalStorage<Post[]>('savedPosts', []);

  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');

  const handleUpload = (imageUrl: string, caption: string, metadata: { title: string; price: string; createdAt: string }) => {
    try {
      const newPost: Post = {
        id: Date.now().toString(),
        imageUrl,
        caption,
        title: metadata.title,
        price: metadata.price,
        likes: 0,
        isLiked: false,
        isSaved: false,
        createdAt: metadata.createdAt,
      };
      
      setUploadedPosts(prev => {
        const newPosts = [newPost, ...prev];
        localStorage.setItem('uploadedPosts', JSON.stringify(newPosts));
        return newPosts;
      });
      setUploadDialogOpen(false);
    } catch (error) {
      console.error('Error uploading post:', error);
      alert('Failed to upload post. Please try again.');
    }
  };

  const handleLike = (postId: string) => {
    try {
      setUploadedPosts(prevPosts => {
        const newPosts = prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked,
            };
          }
          return post;
        });
        localStorage.setItem('uploadedPosts', JSON.stringify(newPosts));
        return newPosts;
      });
    } catch (error) {
      console.error('Error handling like:', error);
      alert('Failed to update like status. Please try again.');
    }
  };

  const handleSave = (postId: string) => {
    try {
      const postToSave = uploadedPosts.find(p => p.id === postId);
      if (!postToSave) {
        console.error('Post not found:', postId);
        return;
      }

      setUploadedPosts(prevPosts => {
        const newPosts = prevPosts.map(post => {
          if (post.id === postId) {
            return { ...post, isSaved: !post.isSaved };
          }
          return post;
        });
        localStorage.setItem('uploadedPosts', JSON.stringify(newPosts));
        return newPosts;
      });

      setSavedPosts(prevSaved => {
        const isAlreadySaved = prevSaved.some(p => p.id === postId);
        let newSaved;
        if (isAlreadySaved) {
          newSaved = prevSaved.filter(p => p.id !== postId);
        } else {
          newSaved = [{ ...postToSave, isSaved: true }, ...prevSaved];
        }
        localStorage.setItem('savedPosts', JSON.stringify(newSaved));
        return newSaved;
      });
    } catch (error) {
      console.error('Error handling save:', error);
      alert('Failed to save post. Please try again.');
    }
  };

  const handleShare = (postId: string) => {
    try {
      const post = uploadedPosts.find(p => p.id === postId);
      if (!post) {
        console.error('Post not found for sharing:', postId);
        return;
      }

      console.log('Sharing post:', post);
      alert('Sharing functionality will be implemented soon!');
    } catch (error) {
      console.error('Error handling share:', error);
      alert('Failed to share post. Please try again.');
    }
  };

  const handleDeletePost = (postId: string) => {
    try {
      // Remove from uploaded posts
      setUploadedPosts(prevPosts => {
        const newPosts = prevPosts.filter(post => post.id !== postId);
        localStorage.setItem('uploadedPosts', JSON.stringify(newPosts));
        return newPosts;
      });
      
      // Also remove from saved posts if it exists there
      setSavedPosts(prevSaved => {
        const newSaved = prevSaved.filter(post => post.id !== postId);
        localStorage.setItem('savedPosts', JSON.stringify(newSaved));
        return newSaved;
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  const handleFollow = () => {
    console.log('Follow clicked');
  };

  const handleMessage = () => {
    console.log('Message clicked');
  };

  const handleProfileUpdate = (updatedFields: Partial<User>) => {
    setUserData(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  const handleThemeChange = (newTheme: CustomTheme) => {
    setCustomTheme(newTheme);
    localStorage.setItem('customTheme', JSON.stringify(newTheme));
    setThemeSelectorOpen(false);  // Close the theme selector
  };

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = (value?: 'newest' | 'oldest' | 'popular') => {
    if (value) {
      setSortBy(value);
    }
    setSortAnchorEl(null);
  };

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('customTheme');
      if (savedTheme) {
        setCustomTheme(JSON.parse(savedTheme));
      }
    } catch (error) {
      console.error('Error reading theme from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('customTheme')) {
      const newTheme = {
        bg: mode === 'light' ? '#F7F8FA' : '#1E1E1E',
        text: mode === 'light' ? '#333333' : '#FFFFFF'
      };
      localStorage.setItem('customTheme', JSON.stringify(newTheme));
      setCustomTheme(newTheme);
    }
  }, [mode]);

  const filteredAndSortedPosts = useMemo(() => {
    const posts = activeTab === 0 ? [...uploadedPosts] : [...savedPosts];
    
    switch (sortBy) {
      case 'oldest':
        return posts.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case 'popular':
        return posts.sort((a, b) => b.likes - a.likes);
      case 'newest':
      default:
        return posts.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [activeTab, uploadedPosts, savedPosts, sortBy]);

  return (
    <>
      <SideBar onThemeClick={() => setThemeSelectorOpen(true)} />
      <StyledContainer customBg={customTheme.bg}>
        <Container maxWidth="lg">
          <Box>
            <StyledCardContent customBg={customTheme.bg} customText={customTheme.text}>
              <ProfileHeader 
                user={userData}
                onFollow={handleFollow}
                onMessage={handleMessage}
                onProfileUpdate={handleProfileUpdate}
                customTheme={customTheme}
              />

              <Divider sx={{ margin: theme.spacing(3, 0) }} />

              <Box sx={{ mt: 3 }}>
                <Box sx={{ 
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3,
                  minHeight: 48,
                }}>
                  <Box sx={{ position: 'absolute', left: 0, zIndex: 2 }}>
                    <IconButton 
                      onClick={handleSortClick}
                      sx={{ 
                        color: customTheme.text,
                        backgroundColor: 'transparent',
                        padding: 1.5,
                        '&:hover': {
                          backgroundColor: `${theme.palette.action.hover}80`,
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: '1.4rem',
                        },
                      }}
                    >
                      <SortIcon />
                    </IconButton>

                    <Menu
                      anchorEl={sortAnchorEl}
                      open={Boolean(sortAnchorEl)}
                      onClose={() => handleSortClose()}
                      transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                      PaperProps={{
                        elevation: 2,
                        sx: {
                          backgroundColor: customTheme.bg,
                          color: customTheme.text,
                          borderRadius: 1,
                          border: `1px solid ${theme.palette.divider}`,
                          minWidth: 180,
                          '& .MuiMenuItem-root': {
                            fontSize: '0.9rem',
                            paddingTop: 1,
                            paddingBottom: 1,
                            '&:hover': {
                              backgroundColor: `${theme.palette.action.hover}80`,
                            },
                            '&.Mui-selected': {
                              backgroundColor: `${theme.palette.primary.main}20`,
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem 
                        onClick={() => handleSortClose('newest')}
                        selected={sortBy === 'newest'}
                      >
                        Newest First
                      </MenuItem>
                      <MenuItem 
                        onClick={() => handleSortClose('oldest')}
                        selected={sortBy === 'oldest'}
                      >
                        Oldest First
                      </MenuItem>
                      <MenuItem 
                        onClick={() => handleSortClose('popular')}
                        selected={sortBy === 'popular'}
                      >
                        Most Popular
                      </MenuItem>
                    </Menu>
                  </Box>

                  <Tabs 
                    value={activeTab} 
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    centered
                    sx={{
                      flex: 1,
                      '& .MuiTabs-indicator': {
                        height: 2,
                        borderRadius: '2px 2px 0 0',
                        backgroundColor: theme.palette.primary.main,
                      },
                    }}
                  >
                    <Tab 
                      icon={<GridViewOutlinedIcon />} 
                      iconPosition="start" 
                      label={`Posts (${uploadedPosts.length})`}
                      sx={{ 
                        textTransform: 'none',
                        fontWeight: 500,
                        color: customTheme.text,
                        '&.Mui-selected': {
                          color: theme.palette.primary.main,
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: '1.5rem',
                          marginRight: 1,
                          color: 'inherit',
                        },
                      }} 
                    />
                    <Tab 
                      icon={<TurnedInNotOutlinedIcon />} 
                      iconPosition="start" 
                      label={`Saved (${savedPosts.length})`}
                      sx={{ 
                        textTransform: 'none',
                        fontWeight: 500,
                        color: customTheme.text,
                        '&.Mui-selected': {
                          color: theme.palette.primary.main,
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: '1.5rem',
                          marginRight: 1,
                          color: 'inherit',
                        },
                      }} 
                    />
                  </Tabs>
                </Box>

                <Fade in={true} timeout={500}>
                  <Box>
                    <PostGrid 
                      posts={filteredAndSortedPosts}
                      onLike={handleLike}
                      onSave={handleSave}
                      onShare={handleShare}
                      onDelete={handleDeletePost}
                    />
                  </Box>
                </Fade>
              </Box>
            </StyledCardContent>
          </Box>

          <UploadButton
            onClick={() => setUploadDialogOpen(true)}
            customBg={customTheme.bg}
            customText={customTheme.text}
          >
            <Fade in={true} timeout={600}>
              <AddIcon />
            </Fade>
          </UploadButton>

          <UploadDialog
            open={uploadDialogOpen}
            onClose={() => setUploadDialogOpen(false)}
            onUpload={handleUpload}
          />

          <ThemeSelector
            open={themeSelectorOpen}
            onClose={() => setThemeSelectorOpen(false)}
            onSelect={handleThemeChange}
            currentTheme={customTheme}
          />
        </Container>
      </StyledContainer>
    </>
  );
};

export default ProfilePage;
