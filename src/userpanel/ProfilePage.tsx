import React, { useState, useRef, useEffect } from 'react';
import { Paper, Box, Container, IconButton } from '@mui/material';
import UploadDialog from './UploadDialog';
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './Tabs';
import ProfileStats from './ProfileStats';
import PostGrid from './PostGrid';
import ThemeSelector from './ThemeSelector';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

import settingsAnimation from 'C:/ReactJs/learn/src/userpanel/userpanelAnimation/lottieflow-menu-nav-11-9-000000-easey.json';



import PhotoCamera from '@mui/icons-material/PhotoCamera';

interface Post {
  title: string;
  price: string;
  description: string;
  image: string; 
}

interface Theme {
  bg: string;
  text: string;
}

const ProfilePage: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('userTheme');
    return savedTheme ? JSON.parse(savedTheme) : { bg: '#F7F8FA', text: '#333' };
  });

  const [uploadedPosts, setUploadedPosts] = useState<Post[]>([]);

  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isThemeSelectorOpen, setThemeSelectorOpen] = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    const savedPosts = localStorage.getItem('uploadedPosts');
    if (savedPosts) {
      setUploadedPosts(JSON.parse(savedPosts));
    }
  }, []);

  const handleUploadDialogOpen = () => setUploadDialogOpen(true);
  const handleUploadDialogClose = () => setUploadDialogOpen(false);

  const handleUpload = (data: { title: string; price: string; description: string; image: File }) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageBase64 = reader.result as string; 
      const newPost = { ...data, image: imageBase64 };
      const updatedPosts = [...uploadedPosts, newPost];

      setUploadedPosts(updatedPosts);
      localStorage.setItem('uploadedPosts', JSON.stringify(updatedPosts)); 
    };
    reader.readAsDataURL(data.image);
  };

  const handleThemeSelectorToggle = () => setThemeSelectorOpen(!isThemeSelectorOpen);

  const handleThemeSelect = (selectedTheme: Theme) => {
    setTheme(selectedTheme);
    localStorage.setItem('userTheme', JSON.stringify(selectedTheme));
  };

  const handleMouseEnter = () => {
    lottieRef.current?.play();
  };

  const handleMouseLeave = () => {
    lottieRef.current?.stop();
  };

  return (
    <Container maxWidth="md">
      <Paper
        elevation={1}
        style={{
          padding: '24px',
          backgroundColor: theme.bg,
          color: theme.text,
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <ProfileHeader />

          <Box
            onClick={handleThemeSelectorToggle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'pointer', width: 40, height: 40 }}
          >
            <Lottie
              lottieRef={lottieRef}
              animationData={settingsAnimation}
              loop={false}
              autoplay={false}
              style={{ width: '100%', height: '100%' }}
            />
          </Box>
        </Box>

        <ProfileStats />

        <Box mt={2}>
          <ProfileTabs />
        </Box>
            
        <Box mt={2}>
          <PostGrid posts={uploadedPosts} />
        </Box>

        {/* Upload Icon Button positioned near the bottom !!! :D !! */}
        <Box display="flex" justifyContent="center" mt={3}>
          <IconButton
            onClick={handleUploadDialogOpen}
            color="default"
            style={{
              backgroundColor: 'transparent',
              color: 'gray',
              border: '1px solid lightgray',
            }}
          >
            <PhotoCamera />
          </IconButton>
        </Box>

        <UploadDialog open={isUploadDialogOpen} onClose={handleUploadDialogClose} onUpload={handleUpload} />

        {isThemeSelectorOpen && (
          <ThemeSelector onSelectTheme={handleThemeSelect} currentTheme={theme} />
        )}
      </Paper>
    </Container>
  );
};

export default ProfilePage;
