import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Tabs, 
  Tab, 
  Box,
  styled,
  useTheme,
  IconButton,
  Typography,
  Container,
  AppBar,
  Tooltip,
} from '@mui/material';
import { useColorMode } from '../context/ColorModeContext';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import whiteLogo from '../assets/white_on_trans.png';
import blackLogo from '../assets/black_on_trans.png';

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    height: 3,
    backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#000',
    borderRadius: '3px',
  },
  '& .MuiTabs-flexContainer': {
    justifyContent: 'center',
  },
  width: '100%',
  marginTop: '-8px',
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '1.1rem',
  padding: '16px 32px',
  minHeight: 56,
  color: theme.palette.mode === 'dark' ? '#E4E6EB' : '#44546F',
  '&:hover': {
    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
    backgroundColor: 'transparent',
    transform: 'translateY(-2px)',
    transition: 'transform 0.2s ease-in-out',
  },
  '&.Mui-selected': {
    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
    fontWeight: 600,
  },
  '&.MuiTab-root': {
    minWidth: 140,
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 0,
  width: '100%',
  marginTop: '-40px',
}));

const Logo = styled('img')(() => ({
  height: '240px',
  cursor: 'pointer',
  transition: 'transform 0.3s ease-in-out, filter 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    filter: 'brightness(1.1)',
  },
  marginBottom: '-35px'
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#E4E6EB' : '#44546F',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.2s ease-in-out',
  padding: theme.spacing(1),
  marginLeft: theme.spacing(1),
}));

const NavbarContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  padding: theme.spacing(0, 3),
  marginBottom: 0,
}));

const UserInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
  marginRight: theme.spacing(2),
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
    transform: 'translateY(-2px)',
  },
}));

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();
  const { username, logout } = useAuth();

  const currentPath = location.pathname.split('/')[1] || 'home';

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    navigate(`/${newValue}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Home', value: 'home' },
    { label: 'Blog', value: 'blog' },
    { label: 'Galleries', value: 'galleries' },
    { label: 'Profile', value: 'profile' },
  ];

  return (
    <Box sx={{ width: '100%', mt: -2 }}>
      <AppBar 
        position="static" 
        color="transparent" 
        elevation={0}
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#fff',
          pt: 0,
          pb: 1,
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 4px 12px rgba(0,0,0,0.3)' 
            : '0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        <NavbarContainer maxWidth="lg">
          <LogoContainer>
            <Logo 
              src={theme.palette.mode === 'dark' ? whiteLogo : blackLogo}
              alt="ZAFERUNI" 
              onClick={() => navigate('/home')}
            />
          </LogoContainer>
          
          <Box sx={{ 
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            position: 'relative',
            mb: 2,
          }}>
            <StyledTabs 
              value={currentPath}
              onChange={handleChange}
              aria-label="navigation tabs"
              centered
            >
              {navItems.map((item) => (
                <StyledTab 
                  key={item.value}
                  label={item.label} 
                  value={item.value}
                />
              ))}
            </StyledTabs>
            
            <Box sx={{ 
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
            }}>
              {username && (
                <UserInfo>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: theme.palette.mode === 'dark' ? '#E4E6EB' : '#44546F',
                      fontWeight: 500,
                    }}
                  >
                    {username}
                  </Typography>
                </UserInfo>
              )}
              <Tooltip title="Logout">
                <ActionButton onClick={handleLogout} size="small">
                  <LogoutIcon />
                </ActionButton>
              </Tooltip>
              <Tooltip title={theme.palette.mode === 'dark' ? 'Light mode' : 'Dark mode'}>
                <ActionButton onClick={toggleColorMode} size="small">
                  {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </ActionButton>
              </Tooltip>
            </Box>
          </Box>
        </NavbarContainer>
      </AppBar>
    </Box>
  );
};

export default Navbar;
