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
  Tab,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
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
import SideBar from '../ProfileSideBar/SideBar';
import userService from '../services/userService';
import axios from 'axios';

interface Painting {
  painting_id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  creation_date: string;
  style?: string;
  material?: string;
  year?: number;
  vertical_depth?: number;
  horizontal_depth?: number;
}

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
  user_id: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  profile_picture?: string;
  biography?: string;
  country?: string;
  city?: string;
  is_gallery: boolean;
  Theme?: string;
  Dark_light_theme?: string;
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
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode } = useColorMode();
  
  // This is the custom profile theme, separate from the global dark/light theme
  const [customTheme, setCustomTheme] = useState<CustomTheme>({
    bg: mode === 'light' ? '#F7F8FA' : '#1E1E1E',
    text: mode === 'light' ? '#333333' : '#FFFFFF'
  });
  
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [themeSelectorOpen, setThemeSelectorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [userData, setUserData] = useState<User | null>(null);
  const [paintings, setPaintings] = useState<Painting[]>([]);
  
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userId = userService.getCurrentUserId();
        const token = localStorage.getItem('token');
        
        if (!userId || !token) {
          console.log('No userId or token found:', { userId, token });
          navigate('/login');
          return;
        }

        // Ensure token is set in axios headers
        axios.defaults.headers.common['Authorization'] = `Token ${token}`;
        
        const [profile, userPaintings] = await Promise.all([
          userService.getUserDetails(userId),
          userService.getUserPaintings(userId)
        ]);
        
        if (profile && 'user_id' in profile) {
          setUserData(profile as User);
          setPaintings(userPaintings);
        } else {
          console.error('Invalid profile data received:', profile);
          navigate('/login');
        }
      } catch (error: unknown) {
        console.error('Error fetching user data:', error);
        if (error && typeof error === 'object' && 'response' in error && 
            error.response && typeof error.response === 'object' && 
            'status' in error.response && error.response.status === 401) {
          console.log('Authentication error detected, clearing tokens');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          delete axios.defaults.headers.common['Authorization'];
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleUpload = async (imageUrl: string, caption: string, metadata: { title: string; price: string; createdAt: string }) => {
    const userId = userService.getCurrentUserId();
    if (!userId) return;

    try {
      const formData = new FormData();
      formData.append('title', metadata.title);
      formData.append('description', caption);
      formData.append('price', metadata.price);
      formData.append('image', imageUrl);
      formData.append('creation_date', metadata.createdAt);

      const response = await userService.addPainting(userId, formData);
      setPaintings(prev => [response, ...prev]);
      setUploadDialogOpen(false);
    } catch (error: unknown) {
      console.error('Error uploading painting:', error);
    }
  };

  const sortedPaintings = useMemo(() => {
    if (!paintings) return [];
    
    const sorted = [...paintings];
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.creation_date).getTime() - new Date(b.creation_date).getTime());
      case 'popular':
        return sorted;
      default:
        return sorted;
    }
  }, [paintings, sortBy]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!userData) {
    return null;
  }

  const paintingsToPosts = (paintings: Painting[]): Post[] => {
    return paintings.map(painting => ({
      id: painting.painting_id,
      imageUrl: painting.image,
      caption: painting.description,
      title: painting.title,
      price: `$${painting.price}`,
      likes: 0,
      isLiked: false,
      isSaved: false,
      createdAt: painting.creation_date,
    }));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar onThemeClick={() => setThemeSelectorOpen(true)} customTheme={customTheme} />
      <StyledContainer customBg={customTheme.bg}>
        <ProfileHeader
          user={{
            fullName: `${userData.firstname} ${userData.lastname}`,
            username: userData.username,
            avatarUrl: userData.profile_picture || '',
            description: userData.biography || '',
            location: userData.city ? `${userData.city}, ${userData.country}` : '',
            followers: 0,
            following: 0,
            socialLinks: {}
          }}
          onProfileUpdate={() => {}}
          customTheme={customTheme}
        />

        <StyledCardContent customBg={customTheme.bg} customText={customTheme.text}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{ '& .MuiTab-root': { color: customTheme.text } }}
            >
              <Tab
                icon={<GridViewOutlinedIcon />}
                label="POSTS"
                sx={{ textTransform: 'none' }}
              />
              <Tab
                icon={<TurnedInNotOutlinedIcon />}
                label="SAVED"
                sx={{ textTransform: 'none' }}
              />
            </Tabs>
          </Box>

          {activeTab === 0 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Tooltip title="Sort posts" placement="top">
                  <IconButton
                    onClick={(e) => setSortAnchorEl(e.currentTarget)}
                    sx={{ color: customTheme.text }}
                  >
                    <SortIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <PostGrid
                posts={paintingsToPosts(sortedPaintings)}
                onLike={() => {}}
                onSave={() => {}}
                onShare={() => {}}
                onDelete={() => {}}
              />
            </>
          )}

          {activeTab === 1 && (
            <Typography color={customTheme.text}>
              Saved paintings feature coming soon...
            </Typography>
          )}
        </StyledCardContent>

        <Menu
          anchorEl={sortAnchorEl}
          open={Boolean(sortAnchorEl)}
          onClose={() => setSortAnchorEl(null)}
          TransitionComponent={Fade}
        >
          <MenuItem
            onClick={() => {
              setSortBy('newest');
              setSortAnchorEl(null);
            }}
          >
            Newest First
          </MenuItem>
          <MenuItem
            onClick={() => {
              setSortBy('oldest');
              setSortAnchorEl(null);
            }}
          >
            Oldest First
          </MenuItem>
          <MenuItem
            onClick={() => {
              setSortBy('popular');
              setSortAnchorEl(null);
            }}
          >
            Most Popular
          </MenuItem>
        </Menu>

        <UploadButton
          onClick={() => setUploadDialogOpen(true)}
          customBg={customTheme.bg}
          customText={customTheme.text}
        >
          <AddIcon />
        </UploadButton>

        <UploadDialog
          open={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          onUpload={handleUpload}
        />

        <ThemeSelector
          open={themeSelectorOpen}
          onClose={() => setThemeSelectorOpen(false)}
          onSelect={(newTheme: CustomTheme) => {
            setCustomTheme(newTheme);
            setThemeSelectorOpen(false);
          }}
          currentTheme={customTheme}
        />
      </StyledContainer>
    </Box>
  );
};

export default ProfilePage;
