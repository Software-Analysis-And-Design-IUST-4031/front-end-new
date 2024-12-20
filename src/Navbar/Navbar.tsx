import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Tabs, 
  Tab, 
  Box,
  styled,
  alpha,
  useTheme,
  IconButton,
  Button,
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material';
import { useColorMode } from '../App';
import blackLogo from './Logos/black_on_trans.png';
import whiteLogo from './Logos/white_on_trans.png';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../AuthContext';
import { Menu as MenuIcon } from '@mui/icons-material';

interface CustomTheme {
  bg: string;
  text: string;
}

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    height: 3,
    borderRadius: '3px 3px 0 0',
    backgroundColor: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  margin: 0,
  padding: 0,
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  '& .MuiTabs-flexContainer': {
    gap: theme.spacing(2),
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.95rem',
  minHeight: 48,
  marginRight: theme.spacing(4),
  color: theme.palette.mode === 'dark' ? '#E4E6EB' : '#44546F',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&.Mui-selected': {
    color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
    fontWeight: 600,
    '&::after': {
      transform: 'scaleX(1)',
      opacity: 0.1,
    },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    background: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
    opacity: 0,
    transform: 'scaleX(0)',
    transformOrigin: 'left',
    transition: 'transform 0.3s ease, opacity 0.3s ease',
    borderRadius: '8px',
    zIndex: -1,
  },
  '&:hover': {
    color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
    opacity: 1,
    '&::after': {
      transform: 'scaleX(1)',
      opacity: 0.1,
    },
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'opacity 0.2s ease',
  padding: 0,
  margin: 0,
  marginTop: '-40px', 
  marginBottom: '-40px', 
  '&:hover': {
    opacity: 0.8,
  },
}));

const Logo = styled('img')({
  height: '40px',
});

export default function AppNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode, toggleColorMode } = useColorMode();
  const { isAuthenticated, username, logout } = useAuth();

  // Remove or comment out debugging logs
  // console.log('Debug Navbar Component:');
  // console.log('Username from useAuth:', username);
  // console.log('Current path:', location.pathname);
  // console.log('Processed current path:', currentPath);

  const currentPath = location.pathname.replace(`/${username}`, '');
  console.log('Processed current path:', currentPath);

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    const path = `/${username}${newValue}`;
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Art Blog
        </Typography>
        {isAuthenticated ? (
          <>
            <Button color="inherit">{username}</Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout <LogoutIcon />
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
            <Button color="inherit" onClick={() => navigate('/signup')}>Signup</Button>
          </>
        )}
        <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}