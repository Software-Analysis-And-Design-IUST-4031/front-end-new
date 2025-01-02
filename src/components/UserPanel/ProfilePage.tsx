import React, { useState, useEffect } from 'react';
import { useParams , useNavigate} from 'react-router-dom';
import { PiChatsLight } from "react-icons/pi";

import {
  Container,
  Box,
  Typography,
  Grid,
  styled,
  useTheme,
  Button,
  IconButton,
  alpha,
  CircularProgress,
  Avatar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TwitterIcon from '@mui/icons-material/Twitter';
import PinterestIcon from '@mui/icons-material/Pinterest';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { MEDIA_URL } from '../../services/api';
import { Painting, BackendPainting, UserProfile } from '../../types';
import Navbar from '../Navbar';
import PaintingGrid from './PaintingGrid';
import ThemeCustomizer from './ThemeCustomizer';
import UploadPaintingDialog from './UploadPaintingDialog';

const MainContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#0A0A0A' : '#FAFAFA',
  minHeight: '100vh',
  backgroundImage: theme.palette.mode === 'dark' 
    ? 'radial-gradient(circle at 50% 0%, rgba(255,64,129,0.03) 0%, rgba(0,0,0,0) 50%)'
    : 'radial-gradient(circle at 50% 0%, rgba(255,64,129,0.02) 0%, rgba(0,0,0,0) 50%)',
}));

const ContentWrapper = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4, 3),
  marginTop: 64,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100vw',
    height: '100%',
    backgroundImage: theme.palette.mode === 'dark'
      ? 'linear-gradient(to bottom, rgba(255,64,129,0.03) 0%, rgba(0,0,0,0) 200px)'
      : 'linear-gradient(to bottom, rgba(255,64,129,0.02) 0%, rgba(0,0,0,0) 200px)',
    pointerEvents: 'none',
  }
}));

const ProfileCard = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(145deg, rgba(20,20,20,0.9) 0%, rgba(30,30,30,0.9) 100%)'
    : 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(250,250,250,0.9) 100%)',
  borderRadius: 32,
  padding: theme.spacing(5),
  marginBottom: theme.spacing(4),
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
    : '0 8px 32px rgba(0, 0, 0, 0.06)',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,64,129,0.03), transparent)',
    transform: 'translateX(-100%)',
    animation: 'shimmer 5s infinite',
  },
  '@keyframes shimmer': {
    '100%': {
      transform: 'translateX(100%)',
    },
  }
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
  backgroundColor: theme.palette.mode === 'dark' ? '#2A2A2A' : '#F5F5F5',
  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
  fontSize: '2.5rem',
  fontWeight: 700,
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A1A1A' : '#F5F5F5',
  borderRadius: 16,
  padding: 12,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#2A2A2A' : '#EBEBEB',
    transform: 'translateY(-2px) scale(1.05)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
  '&:active': {
    transform: 'translateY(0) scale(0.95)',
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  padding: '12px 28px',
  textTransform: 'none',
  fontWeight: 600,
  backgroundColor: theme.palette.mode === 'dark' ? '#2A2A2A' : '#F5F5F5',
  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#3A3A3A' : '#EBEBEB',
  },
  '&.outlined': {
    borderColor: theme.palette.mode === 'dark' ? '#3A3A3A' : '#E0E0E0',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    },
  },
}));

const TabButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.secondary,
  borderRadius: '4px 4px 0 0',
  padding: theme.spacing(2, 4),
  '&[data-active="true"]': {
    color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
    borderBottom: `2px solid ${theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000'}`,
  },
}));

const NameTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
  fontWeight: 'bold',
  letterSpacing: '-0.5px',
  fontSize: '2rem',
  marginBottom: theme.spacing(1),
}));

const UsernameTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  letterSpacing: '0.2px',
  fontSize: '1rem',
}));

const StatsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(6),
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
  borderRadius: 16,
}));

const StatsItem = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  '& .MuiTypography-h5': {
    color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
    fontWeight: 700,
    marginBottom: theme.spacing(0.5),
  },
  '& .MuiTypography-body2': {
    color: theme.palette.text.secondary,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    fontSize: '0.75rem',
  },
}));

const BioTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  lineHeight: 1.6,
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
  borderRadius: 12,
}));

const LocationBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
  padding: theme.spacing(1, 2),
  borderRadius: 12,
  width: 'fit-content',
}));

const UploadButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#2A2A2A' : '#FFFFFF',
  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
  position: 'relative',
  overflow: 'hidden',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#3A3A3A' : '#F5F5F5',
  },
}));

const ProfilePage: React.FC = () => {
  const theme = useTheme(); 
  let { userProfile , userId , isLoading } = useAuth();
  const { userId2} = useParams();
  console.log("FFFFFFFFFFF" +  userId2);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [savedPaintings, setSavedPaintings] = useState<Painting[]>([]);
  const [isLoadingPaintings, setIsLoadingPaintings] = useState(true);
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userProfile2 , setUserProfile2] = useState<any>() ;
  const [userId3 , setUserId3] = useState<number>(0);
  const navigate = useNavigate();
  useEffect(() => {  
    // console.log("userid " + userId);
    // console.log("profile " + userProfile);
    // console.log("userId2 " + userId2);
    // console.log("userprofile2 " + userProfile2);
    const fetchUserProfile = async () => {  
      if (userId2) {  
        try {  
          setUserId3(parseInt(userId2));
          const profile : any = await userService.getUserProfile(parseInt(userId2)); // Get profile for the userId  
          setUserProfile2(profile); // Update the profile state  
        } catch (error) {  
          console.error('Error fetching user profile:', error);  
        }   
      }   
      else 
      {
        let user__id = localStorage.getItem("userId");
        if (user__id)
        {
          try {  
            setUserId3(parseInt(user__id));
            const profile : any = await userService.getUserProfile(parseInt(user__id)); // Get profile for the userId  
            setUserProfile2(profile); // Update the profile state  
          } catch (error) {  
            console.error('Error fetching user profile:', error);  
          }  
        }

        // if (userProfile && userId)
        // {
        //   setUserId3(userId);
        //   setUserProfile2(userProfile);
        // }

      }
    };  
    
    fetchUserProfile();  
    console.log("userid " + userId);
    console.log("profile " + userProfile);
    console.log("userId2 " + userId2);
    console.log("userprofile2 " + userProfile2);

  }, [userId2]); // Add userId2 as a dependenc


  const transformPaintings = (backendPaintings: BackendPainting[], userLikes: number[] = []): Painting[] => {
    if (!Array.isArray(backendPaintings)) {
      console.error('Invalid backendPaintings:', backendPaintings);
      return [];
    }
    return backendPaintings.map(painting => {
      // Construct the full image URL
      const imageUrl = painting.image?.startsWith('http') 
        ? painting.image 
        : `${MEDIA_URL}${painting.image}`;

      return {
        id: String(painting.painting_id),
        imageUrl,
        title: painting.title || 'Untitled',
        description: painting.description || '',
        price: painting.price || 0,
        likes: 0, // This will be updated when we implement the likes feature
        isLiked: Array.isArray(userLikes) && userLikes.includes(painting.painting_id),
        isSaved: false, // This will be updated when we implement the save feature
        createdAt: painting.creation_date
      };
    });
  };

  const getInitials = (firstname: string, lastname: string) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  };
  const userIdFromStorage = localStorage.getItem("userId");

  const handlePaintingAction = async (action: string, paintingId: string) => {
    if (action === 'delete') {
      try {
        setIsDeleting(true);
        await userService.deletePainting(paintingId);
        
        // Remove the deleted painting from the state
        setPaintings(prevPaintings => prevPaintings.filter(p => p.id !== paintingId));
      } catch (error) {
        console.error('Error deleting painting:', error);
      } finally {
        setIsDeleting(false);
      }
    }
    // Handle other actions like 'like', 'save', etc.
  };

  useEffect(() => {
    const fetchPaintings = async () => {
      if (!userId3) {
        console.log('No userId available, skipping painting fetch');
        return;
      }
      
      try {
        if (activeTab === 'posts') {
          setIsLoadingPaintings(true);
          console.log('Fetching paintings for userId:', userId3);
          const [paintingsResponse, userLikes] = await Promise.all([
            userService.getUserPaintings(userId3),
            userService.getUserLikes(userId3)
          ]);
          console.log('Paintings response:', paintingsResponse);
          
          if (!paintingsResponse.paintings) {
            console.error('No paintings array in response:', paintingsResponse);
            return;
          }
          
          const transformedPaintings = transformPaintings(paintingsResponse.paintings, userLikes);
          console.log('Transformed paintings:', transformedPaintings);
          setPaintings(transformedPaintings);
        } else {
          setIsLoadingSaved(true);
          // TODO: Implement saved paintings fetch when backend is ready
          setSavedPaintings([]);
        }
      } catch (error) {
        console.error('Error fetching paintings:', error);
      } finally {
        setIsLoadingPaintings(false);
        setIsLoadingSaved(false);
      }
    };

    fetchPaintings();
  }, [userId3, activeTab]);

  const handleUpload = async (data: FormData) => {
    try {
      if (!userId) {
        console.error('No userId available for upload');
        return;
      }

      console.log('Starting painting upload...');
      const uploadedPainting = await userService.uploadPainting(data);
      console.log('Painting uploaded successfully:', uploadedPainting);

      // Fetch both updated paintings and likes after successful upload
      const [paintingsResponse, userLikes] = await Promise.all([
        userService.getUserPaintings(userId3),
        userService.getUserLikes(userId3)
      ]);
      console.log('Updated paintings after upload:', paintingsResponse);

      if (!paintingsResponse.paintings) {
        console.error('No paintings array in response after upload:', paintingsResponse);
        return;
      }

      const transformedPaintings = transformPaintings(paintingsResponse.paintings, userLikes);
      console.log('Setting new paintings:', transformedPaintings);
      setPaintings(transformedPaintings);
      setUploadDialogOpen(false);
    } catch (error) {
      console.error('Failed to upload painting:', error);
      // TODO: Show error message to user
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!userProfile2) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <Typography variant="h6">Failed to load profile</Typography>
      </Box>
    );
  }

  return (
    <MainContainer>
      <Navbar />
      <ContentWrapper maxWidth="lg">
        <ProfileCard>
          <Box sx={{ display: 'flex', gap: 5, alignItems: 'flex-start' }}>
            <ProfileAvatar
              alt={userProfile2.username}
              src={userProfile2.profile_picture || undefined}
            >
              {!userProfile2.profile_picture && getInitials(userProfile2.firstname, userProfile2.lastname)}
            </ProfileAvatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <NameTypography>
                      {userProfile2.firstname} {userProfile2.lastname}
                    </NameTypography>
                  { userIdFromStorage && parseInt(userIdFromStorage) === userId3 &&
                     <IconButton 
                      size="small" 
                      sx={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton> 
                  }
                  </Box>
                  <UsernameTypography>
                    @{userProfile2.username}
                  </UsernameTypography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <ActionButton className="outlined" variant="outlined">
                    Follow
                  </ActionButton>
                    { userIdFromStorage && parseInt(userIdFromStorage) !== userId3 &&
                      <ActionButton
                        variant="contained"
                        startIcon={<EmailOutlinedIcon />}
                        onClick={async () => {
                          try {
                            // Assuming 'username' is available in your component's props or state
                            await userService.startChat(userProfile2.username);
                            // navigate('/chatpage') ;
                            navigate('/chatpage', { state: { userId: userProfile2.id, username: userProfile2.username } });
                            alert('Chat started successfully!');
                          } catch (error) {
                            // navigate('/chatpage') ;
                            navigate('/chatpage', { state: { userId: userProfile2.id, username: userProfile2.username } });
                          }
                        }}
                      >
                        Message
                      </ActionButton>
                    }
                    { userIdFromStorage && parseInt(userIdFromStorage) === userId3 &&
                      <ActionButton
                        variant="contained"
                        onClick = {() => navigate('/chatpage')}
                      >
                        <PiChatsLight style={{ fontSize: '2rem' }} />
                      </ActionButton>
                    }
                </Box>
              </Box>

              <BioTypography variant="body1">
                {userProfile2.biography || 'No biography added yet.'}
              </BioTypography>
              
              {(userProfile2.city || userProfile2.country) && (
                <LocationBox>
                  <LocationOnIcon fontSize="small" />
                  <Typography variant="body2">
                    {[userProfile2.city, userProfile2.country].filter(Boolean).join(', ')}
                  </Typography>
                </LocationBox>
              )}

              <StatsContainer>
                <StatsItem>
                  <Typography variant="h5" fontWeight="600">
                    {userProfile2.number_of_paintings || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ letterSpacing: '0.5px' }}>
                    posts
                  </Typography>
                </StatsItem>
                <StatsItem>
                  <Typography variant="h5" fontWeight="600">
                    {userProfile2.followers || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ letterSpacing: '0.5px' }}>
                    followers
                  </Typography>
                </StatsItem>
                <StatsItem>
                  <Typography variant="h5" fontWeight="600">
                    {userProfile2.following || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ letterSpacing: '0.5px' }}>
                    following
                  </Typography>
                </StatsItem>
              </StatsContainer>

              {userProfile2.favorite_painter && (
                <Box sx={{ display: 'flex', gap: 1.5, mt: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Favorite Painter: {userProfile2.favorite_painter}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </ProfileCard>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#2A2A2A' : '#EFEFEF'}`,
          pb: 1,
          position: 'relative'
        }}>
          <Box sx={{ 
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 2
          }}>
            <TabButton
              onClick={() => setActiveTab('posts')}
              data-active={activeTab === 'posts'}
            >
              Posts
            </TabButton>
            <TabButton
              onClick={() => setActiveTab('saved')}
              data-active={activeTab === 'saved'}
            >
              Saved
            </TabButton>
          </Box>
          <Box sx={{ visibility: 'hidden' }}>
            <TabButton>Posts</TabButton>
          </Box>
          { userIdFromStorage && parseInt(userIdFromStorage) === userId3 &&
          (
            <UploadButton
              startIcon={<AddIcon />}
              onClick={() => setUploadDialogOpen(true)}
            >
              Upload Painting
            </UploadButton>
          )
          }
        </Box>

        {(isLoadingPaintings && activeTab === 'posts') || (isLoadingSaved && activeTab === 'saved') ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '200px' 
          }}>
            <CircularProgress />
          </Box>
        ) : activeTab === 'saved' ? (
          savedPaintings.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              minHeight: '200px',
              gap: 2,
              color: 'text.secondary'
            }}>
              <Typography variant="h6">No saved paintings yet</Typography>
              <Typography variant="body2">Your saved paintings will appear here</Typography>
            </Box>
          ) : (
            <PaintingGrid 
              paintings={savedPaintings} 
              onAction={handlePaintingAction}
            />
          )
        ) : (
          <PaintingGrid 
            paintings={paintings} 
            onAction={handlePaintingAction}
          />
        )}

        <UploadPaintingDialog
          open={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          onUpload={handleUpload}
        />
      </ContentWrapper>
    </MainContainer>
  );
};

export default ProfilePage;
