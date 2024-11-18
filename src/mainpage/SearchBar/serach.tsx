import React from 'react';
import SearchBar from './searchbar';

const App: React.FC = () => {
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Implement search logic here (e.g., filter data or make an API call)
  };

  return (
    <div style={{ padding: '2rem' }}>
      <SearchBar placeholder="Search for art..." onSearch={handleSearch} />
      {/* Add more components below */}
    </div>
  );
};

export default App;
