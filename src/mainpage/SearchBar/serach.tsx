import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, IconButton, InputAdornment, Box } from '@mui/material';
import { ArrowRight } from '@mui/icons-material';

export const SearchBar: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    console.log('Searching for:', searchValue);
    // Implement search navigation or functionality
  };

  return (
    <Box sx={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <TextField
        fullWidth
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search questions"
        onKeyPress={(e) => {
          if (e.key === 'Enter') handleSearch();
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearch} edge="end">
                <ArrowRight />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBar;