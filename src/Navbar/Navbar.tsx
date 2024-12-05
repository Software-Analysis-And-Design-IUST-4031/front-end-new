import { useLocation, useNavigate } from "react-router-dom";
import { 
  Tabs, 
  Tab, 
  Box,
  styled,
  alpha,
  useTheme,
  IconButton,
} from '@mui/material';
import { useColorMode } from '../App';
import { useState } from 'react';
import blackLogo from './Logos/black_on_trans.png';
import whiteLogo from './Logos/white_on_trans.png';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

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
  height: '300px',
  width: 'auto',
  objectFit: 'contain',
  display: 'block',
  margin: 0,
  padding: 0,
  verticalAlign: 'top', 
});

export default function AppNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode, toggleColorMode } = useColorMode();
  const [customTheme] = useState<CustomTheme>(() => {
    try {
      const savedTheme = localStorage.getItem('customTheme');
      if (savedTheme) {
        return JSON.parse(savedTheme);
      }
    } catch (error) {
      console.error('Error reading theme from localStorage:', error);
    }
    return {
      bg: mode === 'light' ? '#F7F8FA' : '#1E1E1E',
      text: mode === 'light' ? '#333333' : '#FFFFFF'
    };
  });

  const currentPath = location.pathname;
  
  // Only show navbar if user is authenticated
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    return null;
  }

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  return (
    <Box sx={{ 
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      mt: '-20px',
      p: 0,
      position: 'relative',
    }}>
      <IconButton
        onClick={toggleColorMode}
        color="inherit"
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          '&:hover': {
            backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
          },
          zIndex: 1300,
        }}
      >
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>

      <LogoContainer onClick={() => navigate('/home')}>
        <Logo 
          src={mode === 'dark' ? whiteLogo : blackLogo} 
          alt="Logo"
        />
      </LogoContainer>

      <Box sx={{ 
        maxWidth: 'md',
        width: '100%',
        backgroundColor: 'transparent',
        borderRadius: 2,
        p: 0,
        mt: '-20px', 
      }}>
        <StyledTabs
          value={currentPath}
          onChange={handleChange}
          centered
          sx={{
            '& .MuiTab-root:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              borderRadius: '8px',
            }
          }}
        >
          <StyledTab label="Home" value="/home" />
          <StyledTab label="Galleries" value="/galleries" />
          <StyledTab label="Blog" value="/blog" />
          <StyledTab label="Profile" value="/profile" />
        </StyledTabs>
      </Box>
    </Box>
  );
}