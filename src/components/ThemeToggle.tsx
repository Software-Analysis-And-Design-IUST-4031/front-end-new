import { IconButton } from '@mui/material';
import { useColorMode } from '../App';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function ThemeToggle() {
  const { toggleColorMode, mode } = useColorMode();

  return (
    <IconButton
      onClick={toggleColorMode}
      color="inherit"
      sx={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        '&:hover': {
          backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
        },
      }}
    >
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}
