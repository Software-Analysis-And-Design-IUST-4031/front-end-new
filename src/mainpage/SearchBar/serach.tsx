import React, { useState } from 'react';
import { InputWithButton } from './searchbar' ;
import { IconArrowRight } from '@tabler/icons-react';
import { rem } from '@mantine/core';


export const SearchBar: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchValue);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <InputWithButton
        value={searchValue}
        onChange={(e) => setSearchValue(e.currentTarget.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') handleSearch();
        }}
        rightSection={
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={handleSearch}
          >
            <IconArrowRight style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </button>
        }
        placeholder="Search questions"
      />
    </div>
  );
};

export default SearchBar;