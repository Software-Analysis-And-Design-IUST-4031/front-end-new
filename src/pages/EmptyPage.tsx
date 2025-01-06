import { Box } from '@mui/material';
import ThemeToggle from '../components/ThemeToggle';

export default function EmptyPage() {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <ThemeToggle />
    </Box>
  );
}
