import React from 'react';
import { TextField, Button, Box } from '@mui/material';

const SearchBar: React.FC = () => {
  const handleSearch = () => {
    // Implement your search functionality here
    console.log('Search triggered');
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" mt={4}>
      <TextField 
        label="Search" 
        variant="outlined" 
        placeholder="Search..." 
        sx={{ width: '300px', mr: 2 }}
      />
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSearch}
      >
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;