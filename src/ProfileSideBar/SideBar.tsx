import React, { useState } from 'react';
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  Typography,
  ButtonBase
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Palette as PaletteIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import EditProfileButtonNew from './EditProfileButtonNew';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SideBarProps {
  onThemeClick: () => void;
  customTheme?: {
    bg: string;
    text: string;
  };
}

const SideBar: React.FC<SideBarProps> = ({ onThemeClick, customTheme }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useLocalStorage('userData', {
    id: '1',
    fullName: 'John Doe',
    username: '@johndoe',
    avatarUrl: '',
    email: 'john@example.com',
    phoneNumber: '',
    location: 'San Francisco, CA',
    dateOfBirth: '',
    bio: '',
  });

  const handleProfileUpdate = (updatedData: any) => {
    setUserData(updatedData);
  };

  const menuItems = [
    { 
      text: 'Edit Profile', 
      icon: <PersonIcon />,
      onClick: () => {
        const editProfileButton = document.getElementById('edit-profile-button');
        if (editProfileButton) {
          editProfileButton.click();
        }
      },
      path: null
    },
    { text: 'Privacy', icon: <LockIcon />, path: '/profile/privacy' },
  ];

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <IconButton
        onClick={toggleDrawer}
        sx={{
          position: 'fixed',
          left: theme.spacing(4),
          top: theme.spacing(3),
          zIndex: theme.zIndex.drawer + 2,
          bgcolor: 'background.paper',
          opacity: open ? 0 : 1,
          visibility: open ? 'hidden' : 'visible',
          transition: 'opacity 0.2s, visibility 0.2s',
          '&:hover': {
            bgcolor: 'action.hover',
          },
          boxShadow: 1,
          '@media (max-width: 1200px)': {
            left: theme.spacing(3),
            top: theme.spacing(3),
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      <EditProfileButtonNew
        userData={userData}
        onProfileUpdate={handleProfileUpdate}
        customTheme={customTheme}
        id="edit-profile-button"
      />

      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            bgcolor: theme.palette.background.paper,
            borderRight: 'none',
            boxShadow: 3,
            padding: theme.spacing(2),
          },
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%',
          gap: 2
        }}>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Menu
            </Typography>
          </Box>

          <List sx={{ flex: 1 }}>
            {menuItems.map((item, index) => (
              <ListItem
                component={ButtonBase}
                key={item.text}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else {
                    navigate(item.path);
                  }
                  setOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255,255,255,0.1)' 
                      : 'rgba(0,0,0,0.05)',
                    transform: 'translateX(5px)',
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 40,
                    color: theme.palette.mode === 'dark' 
                      ? 'rgba(255,255,255,0.7)' 
                      : 'rgba(0,0,0,0.7)',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    sx: { 
                      fontWeight: 500,
                      color: theme.palette.mode === 'dark' 
                        ? 'rgba(255,255,255,0.9)' 
                        : 'rgba(0,0,0,0.9)',
                    }
                  }}
                />
              </ListItem>
            ))}
            <ListItem
              component={ButtonBase}
              onClick={() => {
                onThemeClick();
                setOpen(false);
              }}
              sx={{
                borderRadius: 2,
                mb: 1,
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255,255,255,0.1)' 
                    : 'rgba(0,0,0,0.05)',
                  transform: 'translateX(5px)',
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: 40,
                  color: theme.palette.mode === 'dark' 
                    ? 'rgba(255,255,255,0.7)' 
                    : 'rgba(0,0,0,0.7)',
                }}
              >
                <PaletteIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Theme"
                primaryTypographyProps={{
                  sx: { 
                    fontWeight: 500,
                    color: theme.palette.mode === 'dark' 
                      ? 'rgba(255,255,255,0.9)' 
                      : 'rgba(0,0,0,0.9)',
                  }
                }}
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default SideBar;