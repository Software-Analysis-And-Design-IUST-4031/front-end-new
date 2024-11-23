import React, { useState, useRef } from 'react';
import {
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  Tabs,
  Tab,
  Paper,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  useTheme,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider
} from '@mui/material';
import { styled } from '@mui/material';
import { Visibility, VisibilityOff, PhotoCamera } from '@mui/icons-material';
import { useColorMode } from './App';
import Cropper from 'react-easy-crop';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', error => reject(error));
    image.src = url;
  });

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  // Make the canvas square with the minimum dimension
  const size = Math.min(pixelCrop.width, pixelCrop.height);
  canvas.width = size;
  canvas.height = size;

  // Create circular clipping path
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI, true);
  ctx.closePath();
  ctx.clip();

  // Calculate the scaling to maintain aspect ratio
  const scaleX = image.width / pixelCrop.width;
  const scaleY = image.height / pixelCrop.height;
  const scale = Math.max(scaleX, scaleY);

  // Calculate the source dimensions
  const srcWidth = size * scale;
  const srcHeight = size * scale;

  // Calculate centering offset
  const srcX = pixelCrop.x * scale + (pixelCrop.width * scale - srcWidth) / 2;
  const srcY = pixelCrop.y * scale + (pixelCrop.height * scale - srcHeight) / 2;

  // Draw the image
  ctx.drawImage(
    image,
    srcX,
    srcY,
    srcWidth,
    srcHeight,
    0,
    0,
    size,
    size
  );

  // Convert to blob and return URL
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Canvas is empty');
      }
      resolve(URL.createObjectURL(blob));
    }, 'image/png');
  });
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  border: '4px solid white',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  backgroundColor: '#d1d1d1',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05) rotate(5deg)',
    transition: 'all 0.3s ease',
    '&::after': {
      opacity: 1,
    }
  },
  '&::after': {
    content: '"Change Photo"',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    fontSize: '14px',
    fontWeight: 500,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '8px 12px',
    borderRadius: '4px',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  }
}));

const ProfileEditor = () => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    nickName: '',
    password: '',
    email: '',
    phoneNumber: '',
    country: '',
    city: '',
    dateOfBirth: '',
    isGallery: 'no'
  });

  // Art Preferences State
  const [artPreferences, setArtPreferences] = useState({
    favoritePainter: '',
    favoritePainting: '',
    favoritePaintingStyle: '',
    favoritePaintingTech: '',
    favoritePaintingOwn: '',
    biography: ''
  });

  // Add photo related state
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [tempPhotoUrl, setTempPhotoUrl] = useState<string>('');

  const handlePersonalInfoChange = (field: keyof typeof personalInfo) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleArtPreferencesChange = (field: keyof typeof artPreferences) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setArtPreferences(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setTempPhotoUrl(imageUrl);
      setShowCropDialog(true);
    }
  };

  const handleCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropConfirm = async () => {
    try {
      if (croppedAreaPixels) {
        const croppedImage = await getCroppedImg(tempPhotoUrl, croppedAreaPixels);
        setPhotoUrl(croppedImage);
        setShowCropDialog(false);
      }
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  return (
    <Paper 
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '24px',
        background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Edit Profile
      </Typography>
      
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        sx={{
          mb: 3,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '1rem',
          }
        }}
      >
        <Tab label="Personal Info" />
        <Tab label="Art Preferences" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Profile Photo Section */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ position: 'relative' }}>
              <StyledAvatar
                src={photoUrl}
                onClick={handlePhotoClick}
              />
              <input
                type="file"
                hidden
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </Box>
          </Grid>

          {/* Image Crop Dialog */}
          <Dialog
            open={showCropDialog}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: '16px',
                background: theme.palette.mode === 'dark' ? '#1A1A1A' : '#FFFFFF',
              }
            }}
          >
            <DialogTitle sx={{ 
              borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              px: 3,
              py: 2,
            }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                Edit Profile Photo
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Move and zoom to adjust your profile photo
              </Typography>
            </DialogTitle>
            <DialogContent
              sx={{
                height: 450,
                position: 'relative',
                backgroundColor: theme.palette.mode === 'dark' ? '#000' : '#f5f5f5',
                p: '24px !important',
                '& .reactEasyCrop_Container': {
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: `2px solid ${theme.palette.primary.main}`,
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                },
                '& .reactEasyCrop_CropArea': {
                  borderRadius: '50%',
                  border: '2px solid #fff',
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                  color: 'rgba(255, 255, 255, 0.8)'
                }
              }}
            >
              {tempPhotoUrl && (
                <Cropper
                  image={tempPhotoUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                  cropShape="round"
                  showGrid={false}
                  objectFit="contain"
                />
              )}
            </DialogContent>
            <Box sx={{ 
              px: 3, 
              py: 2, 
              borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` 
            }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Zoom
              </Typography>
              <Box sx={{ px: 1, py: 1 }}>
                <Slider
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="zoom-slider"
                  onChange={(e, value) => setZoom(value as number)}
                  sx={{
                    '& .MuiSlider-thumb': {
                      width: 24,
                      height: 24,
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: '0 0 0 8px rgba(25, 118, 210, 0.16)'
                      }
                    },
                    '& .MuiSlider-track': {
                      height: 4
                    },
                    '& .MuiSlider-rail': {
                      height: 4,
                      opacity: 0.2
                    }
                  }}
                />
              </Box>
            </Box>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button 
                onClick={() => setShowCropDialog(false)}
                variant="outlined"
                sx={{ 
                  borderRadius: '8px',
                  textTransform: 'none',
                  px: 3
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCropConfirm} 
                variant="contained" 
                sx={{ 
                  borderRadius: '8px',
                  textTransform: 'none',
                  px: 3
                }}
              >
                Save Photo
              </Button>
            </DialogActions>
          </Dialog>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              value={personalInfo.firstName}
              onChange={handlePersonalInfoChange('firstName')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              value={personalInfo.lastName}
              onChange={handlePersonalInfoChange('lastName')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nickname"
              value={personalInfo.nickName}
              onChange={handlePersonalInfoChange('nickName')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={personalInfo.password}
              onChange={handlePersonalInfoChange('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={personalInfo.email}
              onChange={handlePersonalInfoChange('email')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={personalInfo.phoneNumber}
              onChange={handlePersonalInfoChange('phoneNumber')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Country"
              value={personalInfo.country}
              onChange={handlePersonalInfoChange('country')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              value={personalInfo.city}
              onChange={handlePersonalInfoChange('city')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              value={personalInfo.dateOfBirth}
              onChange={handlePersonalInfoChange('dateOfBirth')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select
              fullWidth
              value={personalInfo.isGallery}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, isGallery: e.target.value }))}
              label="Gallery Status"
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Favorite Painter"
              value={artPreferences.favoritePainter}
              onChange={handleArtPreferencesChange('favoritePainter')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Favorite Painting"
              value={artPreferences.favoritePainting}
              onChange={handleArtPreferencesChange('favoritePainting')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Favorite Painting Style"
              value={artPreferences.favoritePaintingStyle}
              onChange={handleArtPreferencesChange('favoritePaintingStyle')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Favorite Painting Technique"
              value={artPreferences.favoritePaintingTech}
              onChange={handleArtPreferencesChange('favoritePaintingTech')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Own Paintings"
              value={artPreferences.favoritePaintingOwn}
              onChange={handleArtPreferencesChange('favoritePaintingOwn')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Biography"
              value={artPreferences.biography}
              onChange={handleArtPreferencesChange('biography')}
            />
          </Grid>
        </Grid>
      </TabPanel>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          sx={{
            textTransform: 'none',
            borderRadius: '12px',
            px: 4,
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Paper>
  );
};

export default ProfileEditor;