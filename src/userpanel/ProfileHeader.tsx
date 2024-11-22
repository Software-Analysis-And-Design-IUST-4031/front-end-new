import React, { useState, useRef, useCallback } from 'react';
import { 
  Avatar, 
  Box, 
  IconButton, 
  Link, 
  Stack, 
  Typography, 
  styled,
  alpha,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slider,
  TextField
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TwitterIcon from '@mui/icons-material/Twitter';
import PinterestIcon from '@mui/icons-material/Pinterest';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import { keyframes } from '@mui/system';
import Cropper from 'react-easy-crop';

interface UserProfile {
  fullName: string;
  username: string;
  avatarUrl?: string;
  description?: string;
  location?: string;
  followers: number;
  following: number;
  socialLinks?: {
    twitter?: string;
    pinterest?: string;
  };
}

interface CustomThemeProps {
  customBg?: string;
  customText?: string;
}

interface ProfileHeaderProps {
  user: UserProfile;
  onFollow?: () => void;
  onMessage?: () => void;
  onAvatarChange: (imageUrl: string) => void;
  onProfileUpdate: (updates: Partial<UserProfile>) => void;
  variant?: 'default' | 'compact';
  customTheme?: {
    bg: string;
    text: string;
  };
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  border: '4px solid white',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  marginTop: '-8px',
  backgroundColor: '#d1d1d1',
  animation: `${fadeIn} 0.6s ease-out`,
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05) rotate(5deg)',
    transition: 'all 0.3s ease',
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

interface ActionButtonProps {
  children: React.ReactNode;
  customText?: string;
  onClick?: () => void;
  startIcon?: React.ReactNode;
}

const CustomButton = styled('button')<ActionButtonProps>(({ customText }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '10px 24px',
  background: 'transparent',
  color: customText || 'inherit',
  border: `2px solid ${customText || 'currentColor'}`,
  borderRadius: '12px',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  fontFamily: 'inherit',
  minWidth: '130px',
  
  '&:hover': {
    background: `${customText ? `${customText}15` : 'rgba(0,0,0,0.1)'}`,
    transform: 'translateY(-2px)',
  },

  '&:active': {
    transform: 'scale(0.98)',
  }
}));

const ActionButton: React.FC<ActionButtonProps> = ({ 
  children, 
  customText, 
  onClick,
  startIcon
}) => {
  return (
    <CustomButton
      customText={customText}
      onClick={onClick}
    >
      {startIcon && (
        <span className="button-icon">
          {startIcon}
        </span>
      )}
      <span className="button-text">{children}</span>
    </CustomButton>
  );
};

const SocialLink = styled(Link)({
  textDecoration: 'none',
  display: 'inline-flex',
});

const SocialButton = styled('button')<CustomThemeProps>(({ customText }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px',
  border: `2px solid ${customText || 'currentColor'}`,
  borderRadius: '8px',
  background: 'transparent',
  color: customText || 'inherit',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    background: `${customText ? `${customText}15` : 'rgba(0,0,0,0.1)'}`,
  },
  '& svg': {
    width: '20px',
    height: '20px',
  },
}));

const getCroppedImg = (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): string => {
  const image = new Image();
  image.src = imageSrc;
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

  return canvas.toDataURL('image/jpeg');
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  user, 
  onFollow, 
  onMessage,
  onAvatarChange,
  onProfileUpdate,
  variant = 'default',
  customTheme
}) => {
  const [isFollowing, setIsFollowing] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleEditClick = () => {
    setEditedUser({
      ...user,
      username: user.username.replace(/@/g, '') // Remove @ when starting to edit
    });
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditSave = () => {
    let processedFields = { ...editedUser };
    
    if (editedUser.username) {
      // Remove any @ symbols and ensure a single @ at the start
      const cleanUsername = editedUser.username.replace(/@/g, '');
      processedFields.username = `@${cleanUsername}`; // Always add a single @ at the start
    }
    
    onProfileUpdate(processedFields);
    setEditDialogOpen(false);
    setEditedUser(user); // Reset edited user state
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImageSrc(reader.result.toString());
          setCropDialogOpen(true);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSave = () => {
    if (!imageSrc || !croppedAreaPixels) {
      console.error('Missing image data');
      return;
    }

    try {
      const croppedImage = getCroppedImg(imageSrc, croppedAreaPixels);
      onAvatarChange(croppedImage);
      setCropDialogOpen(false);
      setImageSrc(null);
    } catch (error) {
      console.error('Failed to crop image:', error);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>      
      <Box sx={{ px: 3, py: 2, position: 'relative' }}>
        <Box display="flex" alignItems="flex-start" gap={4}>
          <Box>
            <StyledAvatar 
              src={user.avatarUrl}
              onClick={() => fileInputRef.current?.click()}
            >
              {!user.avatarUrl && user.fullName[0].toUpperCase()}
            </StyledAvatar>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </Box>
          <Box flex={1}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
              <Box sx={{ animation: `${fadeIn} 0.6s ease-out 0.2s backwards` }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 700, 
                    mb: 1, 
                    color: customTheme?.text || 'inherit',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {user.fullName}
                  </Typography>
                  <IconButton 
                    onClick={handleEditClick}
                    sx={{ 
                      color: customTheme?.text || 'inherit',
                      opacity: 0.7,
                      '&:hover': { opacity: 1 }
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
                <Typography variant="subtitle1" sx={{ 
                  mb: 2, 
                  opacity: 0.9, 
                  color: customTheme?.text || 'inherit',
                  fontWeight: 500
                }}>
                  {user.username}
                </Typography>
                
                <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 2 }}>
                  {user.location && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocationOnIcon fontSize="small" sx={{ color: 'inherit', opacity: 0.7 }} />
                      <Typography variant="body2" sx={{ fontWeight: 500, color: 'inherit' }}>
                        {user.location}
                      </Typography>
                    </Box>
                  )}
                  
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'inherit' }}>
                    <strong>{user.followers}</strong> followers
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'inherit' }}>
                    <strong>{user.following}</strong> following
                  </Typography>
                </Stack>

                {user.description && (
                  <Typography variant="body1" sx={{ 
                    mb: 2, 
                    maxWidth: '600px', 
                    lineHeight: 1.6,
                    color: customTheme?.text || 'inherit',
                    opacity: 0.9
                  }}>
                    {user.description}
                  </Typography>
                )}

                <Stack direction="row" spacing={2}>
                  <ActionButton
                    customText={customTheme?.text}
                    onClick={() => setIsFollowing(!isFollowing)}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </ActionButton>
                  <ActionButton
                    customText={customTheme?.text}
                    onClick={onMessage}
                    startIcon={<EmailIcon />}
                  >
                    Message
                  </ActionButton>
                </Stack>
              </Box>

              {user.socialLinks && (
                <Stack direction="row" spacing={2}>
                  {user.socialLinks.twitter && (
                    <SocialLink
                      href={user.socialLinks.twitter}
                      target="_blank"
                    >
                      <SocialButton
                        customText={customTheme?.text}
                      >
                        <TwitterIcon />
                      </SocialButton>
                    </SocialLink>
                  )}
                  {user.socialLinks.pinterest && (
                    <SocialLink
                      href={user.socialLinks.pinterest}
                      target="_blank"
                    >
                      <SocialButton
                        customText={customTheme?.text}
                      >
                        <PinterestIcon />
                      </SocialButton>
                    </SocialLink>
                  )}
                </Stack>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      <Dialog
        open={editDialogOpen}
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Full Name"
              fullWidth
              value={editedUser.fullName}
              onChange={(e) => setEditedUser(prev => ({ ...prev, fullName: e.target.value }))}
            />
            <TextField
              label="Username"
              fullWidth
              value={editedUser.username}
              onChange={(e) => {
                const value = e.target.value;
                // Remove all @ symbols and add a single @ at the start
                const cleanValue = value.replace(/@/g, '');
                setEditedUser(prev => ({ 
                  ...prev, 
                  username: cleanValue // Don't add @ here, it will be added when saving
                }));
              }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={editedUser.description || ''}
              onChange={(e) => setEditedUser(prev => ({ ...prev, description: e.target.value }))}
            />
            <TextField
              label="Location"
              fullWidth
              value={editedUser.location || ''}
              onChange={(e) => setEditedUser(prev => ({ ...prev, location: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={cropDialogOpen}
        onClose={() => setCropDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Crop Profile Photo</DialogTitle>
        <DialogContent>
          <Box sx={{ position: 'relative', height: 400, mb: 2 }}>
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                cropShape="round"
                showGrid={false}
              />
            )}
          </Box>
          <Box sx={{ px: 2 }}>
            <Typography gutterBottom>Zoom</Typography>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e, value) => setZoom(value as number)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCropDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            variant="contained" 
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfileHeader;
