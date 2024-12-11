import React from 'react';
import { Button as MuiButton } from '@mui/material';

// Define ButtonProps interface
interface ButtonProps {
  label: string;
  onClick: () => void;
  styleType: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ label, onClick, styleType }) => {
  return (
    <MuiButton
      onClick={onClick}
      variant="contained"
      sx={{
        backgroundColor: 'black', // Set the background color to black
        color: 'white', // Set the text color to white for contrast
        '&:hover': {
          backgroundColor: '#333', // Slightly lighter black on hover
        },
        margin: '0 8px', 
        padding: '8px 16px',
      }}
    >
      {label}
    </MuiButton>
  );
};

export default Button;
