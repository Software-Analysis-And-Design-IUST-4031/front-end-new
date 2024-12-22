import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Tabs, 
  Tab, 
  Box,
  styled,
  useTheme,
  IconButton,
  Tooltip,
  Container,
  AppBar,
} from '@mui/material';
import { ColorModeContext } from '../../../context/ColorModeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import whiteLogo from '../../../assets/white_on_trans.png';
import blackLogo from '../../../assets/black_on_trans.png';

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

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  // Extract current path to determine the active tab
  const currentPath = location.pathname.split('/')[1];

  const navItems = [
    { label: 'Sign Up', value: 'signup' },
    { label: 'Log In', value: 'login' },
  ];

  const isValidPath = navItems.some((item) => item.value === currentPath);

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    navigate(`/${newValue}`);
  };

  return (
    <Box sx={{ width: '100%', mt: -2 }}>
      <AppBar 
        position="static" 
        color="transparent" 
        elevation={0}
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          backgroundColor: colorMode.mode === 'dark' ? '#1a1a1a' : '#fff',
          pt: 0,
          pb: 1,
          boxShadow: colorMode.mode === 'dark' 
            ? '0 4px 12px rgba(0,0,0,0.3)' 
            : '0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 2,
            }}
          >
            <Box
              component="img"
              src={colorMode.mode === 'dark' ? whiteLogo : blackLogo}
              alt="ZAFERUNI"
              onClick={() => navigate('/')}
              sx={{
                height: 40,
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <StyledTabs
                value={isValidPath ? currentPath : false}
                onChange={handleChange}
              >
                {navItems.map((item) => (
                  <StyledTab
                    key={item.value}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </StyledTabs>
              
              <Tooltip title={colorMode.mode === 'dark' ? 'Light mode' : 'Dark mode'}>
                <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                  {colorMode.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Container>
      </AppBar>
    </Box>
  );
};

export default Navbar;
