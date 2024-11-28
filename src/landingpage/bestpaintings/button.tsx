import React from 'react';
import { Button as MuiButton } from '@mui/material';

interface ButtonProps {
  label: string;
  onClick: () => void;
  styleType: 'primary' | 'secondary';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, styleType, disabled }) => {
  return (
    <MuiButton
      onClick={onClick}
      variant="contained"
      disabled={disabled}
      sx={{
        backgroundColor: 'black !important', // Force black background
        color: 'white !important', // Force white text
        '&:hover': {
          backgroundColor: '#333 !important', // Slightly lighter black on hover
        },
        '&.Mui-disabled': {
          backgroundColor: '#666 !important', // Gray for disabled buttons
          color: '#ddd !important',
        },
        margin: '0 8px',
        padding: '8px 16px',
        textTransform: 'none', // Prevent uppercase text transformation
      }}
    >
      {label}
    </MuiButton>
  );
};

export default Button;
