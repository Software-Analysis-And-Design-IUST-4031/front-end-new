import React, { useState, useRef } from 'react';
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Grid,
  TextField,
  Typography,
  Tabs,
  Tab,
  Paper,
  Select,
  MenuItem,
  InputAdornment,
  useTheme,
  Avatar,
  styled,
  Slider,
  FormControl,
  InputLabel,
  Autocomplete,
  SelectChangeEvent,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import PaletteIcon from '@mui/icons-material/Palette';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useColorMode } from '../App';
import Cropper from 'react-easy-crop';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import axios from 'axios';

interface EditProfileButtonProps {
  userData: any;
  onProfileUpdate: (updatedData: any) => void;
  customTheme?: {
    bg: string;
    text: string;
  };
  id?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

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

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Convert to base64 string
  return canvas.toDataURL('image/jpeg', 0.9);
};

const EditProfileButton: React.FC<EditProfileButtonProps> = ({
  userData,
  onProfileUpdate,
  customTheme,
  id
}) => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    firstname: userData?.fullName?.split(' ')[0] || '',
    lastname: userData?.fullName?.split(' ')[1] || '',
    nickname: userData?.username?.replace('@', '') || '',
    password: '',
    email: userData?.email || '',
    phone_number: userData?.phoneNumber || '',
    country: userData?.location?.split(', ')[1] || '',
    city: userData?.location?.split(', ')[0] || '',
    date_of_birth: userData?.dateOfBirth || '',
    is_gallery: userData?.isGallery || localStorage.getItem('isGallery') || 'no'
  });

  // Art Preferences State
  const [artPreferences, setArtPreferences] = useState({
    favoritePainter: userData?.favoritePainter || '',
    favoritePainting: userData?.favoritePainting || '',
    favoritePaintingStyle: userData?.favoritePaintingStyle || '',
    favoritePaintingTech: userData?.favoritePaintingTech || '',
    favoritePaintingOwn: userData?.favoritePaintingOwn || '',
    biography: userData?.bio || ''
  });

  // Photo related state
  const [photoUrl, setPhotoUrl] = useState<string>(userData?.avatarUrl || '');
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [tempPhotoUrl, setTempPhotoUrl] = useState<string>('');

  const handleEditClick = () => {
    setIsEditorOpen(true);
  };

  const handleClose = () => {
    setIsEditorOpen(false);
  };

  const handlePersonalInfoChange = (field: keyof typeof personalInfo) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    //const value = (event.target as HTMLInputElement).value || (event.target as {value: unknown}).value;
    setPersonalInfo(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleGalleryChange = (event: any) => {
    setPersonalInfo(prev => ({
      ...prev,
      isGallery: event.target.value
    }));
  };

  const handleArtPreferencesChange = (field: keyof typeof artPreferences) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
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
        
        URL.revokeObjectURL(tempPhotoUrl);
      }
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  const countries = [{
      name: 'Iran',
      cities: ["Tehran", "Isfahan", "Mashhad", "Tabriz", "Semnan"]
    }, {
      name: 'France',
      cities: ["Paris", "Mars"]
    }, {
      name: 'USA',
      cities: ["NewYork", "Texas", "MeryLand", "WanshinTon", "Nevada"]
    }
  ];

  const favorite_painters = [
    "Leonardo da Vinci",
    "Vincent van Gogh",
    "Pablo Picasso",
    "Claude Monet",
    "Salvador Dalí",
    "Frida Kahlo",
    "Rembrandt",
    "Michelangelo",
    "Georgia O'Keeffe",
    "Edvard Munch"
  ];
  const favorite_paintings = [
    "Mona Lisa",
    "The Starry Night",
    "Guernica",
    "The Persistence of Memory",
    "The Last Supper",
    "Girl with a Pearl Earring",
    "The Scream",
    "Water Lilies",
    "The Creation of Adam",
    "American Gothic"
  ];
  const favorite_painting_styles = [
    "Realism",
    "Impressionism",
    "Cubism",
    "Surrealism",
    "Abstract",
    "Expressionism",
    "Baroque",
    "Renaissance",
    "Fauvism",
    "Minimalism"
  ];
  const favorite_painting_techniques = [
    "Oil Painting",
    "Watercolor",
    "Acrylic Painting",
    "Fresco",
    "Tempera",
    "Gouache",
    "Impasto",
    "Encaustic",
    "Glazing",
    "Dry Brush"
  ];
  const favorite_painting_to_own = [
    "Mona Lisa",
    "The Starry Night",
    "Guernica",
    "The Persistence of Memory",
    "The Last Supper",
    "Girl with a Pearl Earring",
    "The Scream",
    "Water Lilies",
    "The Creation of Adam",
    "American Gothic"
  ];

  const handleSubmit = async () => {
    const updatedData = {
      ...userData,
      fullName: `${personalInfo.firstname} ${personalInfo.lastname}`,
      username: `@${personalInfo.nickname}`,
      email: personalInfo.email,
      phoneNumber: personalInfo.phone_number,
      location: `${personalInfo.city}, ${personalInfo.country}`,
      dateOfBirth: personalInfo.date_of_birth,
      isGallery: personalInfo.is_gallery,
      avatarUrl: photoUrl,
      bio: artPreferences.biography,
      favoritePainter: artPreferences.favoritePainter,
      favoritePainting: artPreferences.favoritePainting,
      favoritePaintingStyle: artPreferences.favoritePaintingStyle,
      favoritePaintingTech: artPreferences.favoritePaintingTech,
      favoritePaintingOwn: artPreferences.favoritePaintingOwn,
    };

    onProfileUpdate(updatedData);
    const token = localStorage.getItem('access_token');
    if (tabValue === 0) {
      const persoInfo = {
        firstname: personalInfo.firstname,
        lastname: personalInfo.lastname,
        nickname: personalInfo.nickname,
        password: personalInfo.password,
        email: personalInfo.email,
        phone_number: personalInfo.phone_number,
        country: personalInfo.country,
        city: personalInfo.city,
        date_of_birth: personalInfo.date_of_birth,
        is_gallery: personalInfo.is_gallery,
        profile_pciture: photoUrl,
      }
      try {
        const response = await axios.put('http://127.0.0.1:8000/api/user/<int:user_id>/updateProfile/', {
          body: persoInfo,
          headers : {
            'Authorization': `Bearer ${token}`
          }
        });

        setPersonalInfo(response.data);
        alert("successful submition!")
      } catch(error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data || 'something went wrong during submition!';
          alert(errorMessage);
        }
      }
    } else if (tabValue === 1) {
      try {
        const response = await axios.put('http://127.0.0.1:8000/api/user/<int:user_id>/updateFavorites/', {
          body: artPreferences,
          headers : {
            'Authorization': `Bearer ${token}`
          }
        });

        setPersonalInfo(response.data);
        alert("successful submition!")
      } catch(error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data || 'something went wrong during submition!';
          alert(errorMessage);
        }
      }
    }

    handleClose();
  };

  const textFieldStyle = mode === 'dark' ? {
    '& .MuiOutlinedInput-root': {
      transition: 'all 0.2s ease-in-out',
      borderRadius: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.15)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.3)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#ffffff',
        borderWidth: '2px',
      },
      '& input': {
        color: '#ffffff',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.7)',
      '&.Mui-focused': {
        color: '#ffffff',
      },
    },
    '& .MuiInputAdornment-root': {
      color: 'rgba(255, 255, 255, 0.7)',
    },
  } : {
    '& .MuiOutlinedInput-root': {
      transition: 'all 0.2s ease-in-out',
      borderRadius: '12px',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      '& fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.23)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.5)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#000000',
        borderWidth: '2px',
      },
      '& input': {
        color: '#000000',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(0, 0, 0, 0.7)',
      '&.Mui-focused': {
        color: '#000000',
      },
    },
    '& .MuiInputAdornment-root': {
      color: 'rgba(0, 0, 0, 0.7)',
    },
  };

  return (
    <>
      <Tooltip title="Edit Profile">
        <IconButton
          onClick={handleEditClick}
          id={id}
          sx={{
            display: 'none',
          }}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>

      <Dialog
        open={isEditorOpen}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        TransitionProps={{
          timeout: 300,
        }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: mode === 'dark' ? '#121212' : '#f5f5f5',
            backgroundImage: 'none',
            boxShadow: mode === 'dark' 
              ? '0 8px 32px rgba(0, 0, 0, 0.4)'
              : '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease-in-out',
          }
        }}
      >
        <DialogTitle sx={{ 
          p: 4, 
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: 1,
          borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          bgcolor: mode === 'dark' ? '#121212' : '#f5f5f5',
        }}>
          <EditIcon sx={{ color: mode === 'dark' ? '#ffffff' : '#000000' }} />
          <Typography variant="h5" sx={{ 
            fontWeight: 600,
            color: mode === 'dark' ? '#ffffff' : '#000000',
            fontSize: '1.5rem'
          }}>
            Edit Profile
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ 
          p: 4,
          bgcolor: mode === 'dark' ? '#121212' : '#f5f5f5',
        }}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ 
              borderBottom: 1, 
              borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              mb: 4,
              bgcolor: mode === 'dark' ? '#121212' : '#f5f5f5',
            }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  bgcolor: mode === 'dark' ? '#121212' : '#f5f5f5',
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '1rem',
                    minHeight: 48,
                    color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                    transition: 'all 0.2s ease-in-out',
                    '&.Mui-selected': {
                      color: mode === 'dark' ? '#ffffff' : '#000000',
                    },
                    '&:hover': {
                      color: mode === 'dark' ? '#ffffff' : '#000000',
                      opacity: 0.8,
                    },
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: mode === 'dark' ? '#ffffff' : '#000000',
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                    transition: 'all 0.2s ease-in-out',
                  }
                }}
              >
                <Tab 
                  label="Personal Info" 
                  icon={<PersonIcon />} 
                  iconPosition="start"
                />
                <Tab 
                  label="Art Preferences" 
                  icon={<PaletteIcon />} 
                  iconPosition="start"
                />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={personalInfo.firstname}
                    onChange={handlePersonalInfoChange('firstname')}
                    variant="outlined"
                    sx={textFieldStyle}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={personalInfo.lastname}
                    onChange={handlePersonalInfoChange('lastname')}
                    variant="outlined"
                    sx={textFieldStyle}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={personalInfo.nickname}
                    onChange={handlePersonalInfoChange('nickname')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">@</InputAdornment>,
                    }}
                    variant="outlined"
                    sx={textFieldStyle}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={personalInfo.password}
                    onChange={handlePersonalInfoChange('password')}
                    variant="outlined"
                    sx={textFieldStyle}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ 
                              color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                              '&:hover': {
                                color: mode === 'dark' ? '#ffffff' : '#000000',
                              }
                            }}
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
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange('email')}
                    variant="outlined"
                    sx={textFieldStyle}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={personalInfo.phone_number}
                    onChange={handlePersonalInfoChange('phone_number')}
                    variant="outlined"
                    sx={textFieldStyle}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    value={personalInfo.date_of_birth}
                    onChange={handlePersonalInfoChange('date_of_birth')}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    sx={textFieldStyle}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={textFieldStyle}>
                    <InputLabel>City</InputLabel>
                    <Select
                      value={personalInfo.city}
                      onChange={handlePersonalInfoChange('city')}
                      disabled={!personalInfo.country}
                      label="City"
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderRadius: '8px',
                        },
                        '& .MuiSelect-select': {
                          borderRadius: '8px',
                        }
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            mt: 1,
                            borderRadius: '8px',
                            '& .MuiMenuItem-root': {
                              mx: 1,
                              my: 0.5,
                              borderRadius: '4px',
                            }
                          }
                        }
                      }}
                    >
                      {personalInfo.country && countries.find((country) => country.name === personalInfo.country)?.cities.map((city: string) => (
                        <MenuItem key={city} value={city}>
                          {city}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={textFieldStyle}>
                    <InputLabel>Country</InputLabel>
                    <Select
                      value={personalInfo.country}
                      onChange={handlePersonalInfoChange('country')}
                      label="Country"
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderRadius: '8px',
                        },
                        '& .MuiSelect-select': {
                          borderRadius: '8px',
                        }
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            mt: 1,
                            borderRadius: '8px',
                            '& .MuiMenuItem-root': {
                              mx: 1,
                              my: 0.5,
                              borderRadius: '4px',
                            }
                          }
                        }
                      }}
                    >
                      {countries.map((country) => (
                        <MenuItem key={country.name} value={country.name}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={textFieldStyle}>
                    <InputLabel>Are you a Gallery?</InputLabel>
                    <Select
                      value={personalInfo.is_gallery}
                      onChange={handlePersonalInfoChange('is_gallery')}
                      label="Are you a Gallery?"
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderRadius: '8px',
                        },
                        '& .MuiSelect-select': {
                          borderRadius: '8px',
                        }
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            mt: 1,
                            borderRadius: '8px',
                            '& .MuiMenuItem-root': {
                              mx: 1,
                              my: 0.5,
                              borderRadius: '4px',
                            }
                          }
                        }
                      }}
                    >
                      <MenuItem value="no">No</MenuItem>
                      <MenuItem value="yes">Yes</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Biography"
                    value={artPreferences.biography}
                    onChange={handleArtPreferencesChange('biography')}
                    variant="outlined"
                    sx={textFieldStyle}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={textFieldStyle}>
                    <InputLabel>Favorite Painter</InputLabel>
                    <Select
                      value={artPreferences.favoritePainter}
                      onChange={handleArtPreferencesChange('favoritePainter')}
                      label="Favorite Painter"
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderRadius: '8px',
                        },
                        '& .MuiSelect-select': {
                          borderRadius: '8px',
                        }
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            mt: 1,
                            borderRadius: '8px',
                            '& .MuiMenuItem-root': {
                              mx: 1,
                              my: 0.5,
                              borderRadius: '4px',
                            }
                          }
                        }
                      }}
                    >
                      {favorite_painters.map((favorite_painter) => (
                        <MenuItem key={favorite_painter} value={favorite_painter}>
                          {favorite_painter}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={textFieldStyle}>
                    <InputLabel>Favorite Painting</InputLabel>
                    <Select
                      value={artPreferences.favoritePainting}
                      onChange={handleArtPreferencesChange('favoritePainting')}
                      label="Favorite Painting"
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderRadius: '8px',
                        },
                        '& .MuiSelect-select': {
                          borderRadius: '8px',
                        }
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            mt: 1,
                            borderRadius: '8px',
                            '& .MuiMenuItem-root': {
                              mx: 1,
                              my: 0.5,
                              borderRadius: '4px',
                            }
                          }
                        }
                      }}
                    >
                      {favorite_paintings.map((favorite_painting) => (
                        <MenuItem key={favorite_painting} value={favorite_painting}>
                          {favorite_painting}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={textFieldStyle}>
                    <InputLabel>Favorite Painting Style</InputLabel>
                    <Select
                      value={artPreferences.favoritePaintingStyle}
                      onChange={handleArtPreferencesChange('favoritePaintingStyle')}
                      label="Favorite Painting Style"
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderRadius: '8px',
                        },
                        '& .MuiSelect-select': {
                          borderRadius: '8px',
                        }
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            mt: 1,
                            borderRadius: '8px',
                            '& .MuiMenuItem-root': {
                              mx: 1,
                              my: 0.5,
                              borderRadius: '4px',
                            }
                          }
                        }
                      }}
                    >
                      {favorite_painting_styles.map((favorite_painting_style) => (
                        <MenuItem key={favorite_painting_style} value={favorite_painting_style}>
                          {favorite_painting_style}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={textFieldStyle}>
                    <InputLabel>Favorite Painting Technique</InputLabel>
                    <Select
                      value={artPreferences.favoritePaintingTech}
                      onChange={handleArtPreferencesChange('favoritePaintingTech')}
                      label="Favorite Painting Technique"
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderRadius: '8px',
                        },
                        '& .MuiSelect-select': {
                          borderRadius: '8px',
                        }
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            mt: 1,
                            borderRadius: '8px',
                            '& .MuiMenuItem-root': {
                              mx: 1,
                              my: 0.5,
                              borderRadius: '4px',
                            }
                          }
                        }
                      }}
                    >
                      {favorite_painting_techniques.map((favorite_painting_technique) => (
                        <MenuItem key={favorite_painting_technique} value={favorite_painting_technique}>
                          {favorite_painting_technique}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={textFieldStyle}>
                    <InputLabel>Favorite Painting To Own</InputLabel>
                    <Select
                      value={artPreferences.favoritePaintingOwn}
                      onChange={handleArtPreferencesChange('favoritePaintingOwn')}
                      label="Your Favorite Own Painting"
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderRadius: '8px',
                        },
                        '& .MuiSelect-select': {
                          borderRadius: '8px',
                        }
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            mt: 1,
                            borderRadius: '8px',
                            '& .MuiMenuItem-root': {
                              mx: 1,
                              my: 0.5,
                              borderRadius: '4px',
                            }
                          }
                        }
                      }}
                    >
                      {favorite_painting_to_own.map((favorite_own_painting) => (
                        <MenuItem key={favorite_own_painting} value={favorite_own_painting}>
                          {favorite_own_painting}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </TabPanel>
          </Box>
        </DialogContent>

        <Dialog
          open={showCropDialog}
          onClose={() => setShowCropDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              bgcolor: mode === 'dark' ? '#121212' : '#f5f5f5',
              backgroundImage: 'none',
              boxShadow: mode === 'dark' 
                ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                : '0 8px 32px rgba(0, 0, 0, 0.1)',
            }
          }}
        >
          <DialogTitle sx={{ 
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: 1,
            borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          }}>
            <Typography variant="h6">Crop Profile Picture</Typography>
          </DialogTitle>
          <DialogContent 
            sx={{ 
              height: 400, 
              p: 3,
              bgcolor: mode === 'dark' ? '#1E1E1E' : '#FAFAFA',
              position: 'relative' 
            }}
          >
            <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
              <Cropper
                image={tempPhotoUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={handleCropComplete}
                onZoomChange={setZoom}
                cropShape="round"
                showGrid={false}
                style={{
                  containerStyle: {
                    width: '100%',
                    height: '100%',
                    backgroundColor: mode === 'dark' ? '#121212' : '#f5f5f5',
                  },
                  cropAreaStyle: {
                    border: '2px solid #fff',
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                  },
                  mediaStyle: {
                    backgroundColor: mode === 'dark' ? '#121212' : '#f5f5f5',
                  }
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions 
            sx={{ 
              p: 3, 
              pt: 2,
              borderTop: 1,
              borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>
              <ZoomInIcon sx={{ color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }} />
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="zoom"
                onChange={(e, value) => setZoom(value as number)}
                sx={{
                  color: mode === 'dark' ? '#ffffff' : '#000000',
                  '& .MuiSlider-thumb': {
                    width: 24,
                    height: 24,
                    transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                    '&:hover': {
                      boxShadow: '0px 0px 0px 8px rgba(0,0,0,0.1)',
                    },
                  },
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'flex-end' }}>
              <Button 
                onClick={() => setShowCropDialog(false)}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  color: mode === 'dark' ? '#ffffff' : '#000000',
                  borderColor: mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                  '&:hover': {
                    borderColor: mode === 'dark' ? '#ffffff' : '#000000',
                    backgroundColor: 'transparent',
                  }
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCropConfirm}
                variant="contained"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  bgcolor: mode === 'dark' ? '#ffffff' : '#000000',
                  color: mode === 'dark' ? '#000000' : '#ffffff',
                  '&:hover': {
                    bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
                  }
                }}
              >
                Apply
              </Button>
            </Box>
          </DialogActions>
        </Dialog>

        <DialogActions sx={{ 
          p: 3,
          borderTop: 1,
          borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          gap: 2,
          bgcolor: mode === 'dark' ? '#121212' : '#f5f5f5',
        }}>
          <Button 
            onClick={handleClose}
            variant="outlined"
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2,
              borderColor: mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)',
              color: mode === 'dark' ? '#ffffff' : '#000000',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: mode === 'dark' ? '#ffffff' : '#000000',
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2,
              bgcolor: mode === 'dark' ? '#ffffff' : '#000000',
              color: mode === 'dark' ? '#000000' : '#ffffff',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditProfileButton;