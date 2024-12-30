import React, { useState, useEffect } from 'react';
import { Box, Pagination, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import Card from './card';

interface Post {
  painting_id: string;
  image: string;
  description: string;
  title: string;
  price: string;  // Price is a string, but we'll convert it to number for comparison
  material: string;
  artist: string;
  year: number;
  style: string;
}

const itemsPerPage = 4;

const Painting: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    price: '',
    style: '',
    material: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://zaferuni.liara.run/api/painting/paintings/search/');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log(data); // Log the data for debugging
    
        // Map the response data and handle missing values
        const mappedPosts = data.map((painting: any) => ({
          painting_id: painting.painting_id,
          image: painting.image || 'https://via.placeholder.com/150', // Fallback image if none exists
          description: painting.description || 'No description available',
          title: painting.title || 'Untitled',
          price: painting.price ? `${painting.price}` : '',
          material: painting.material || 'Material not specified',
          style: painting.style || 'Style not specified',
          year: painting.year || 'Year not specified',
          vertical_depth: painting.vertical_depth || 'N/A',
          horizontal_depth: painting.horizontal_depth || 'N/A',
        }));
    
        setPosts(mappedPosts);
      } catch (err) {
        console.error('Error fetching paintings:', err);
        setError('Failed to load paintings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    

    fetchData();
  }, []);

  // Filter the paintings based on user input and filters
  const filteredPaintings = posts.filter((post) => {
    const price = parseFloat(post.price); // Convert price to a number for comparison
    const filterPrice = filters.price ? parseFloat(filters.price) : Infinity; // If no price filter, set to Infinity
  
    return (
      // Filter by style (if filter is applied)
      (post.style.toLowerCase().includes(filters.style.toLowerCase()) || !filters.style) &&
      
      // Filter by material (if filter is applied)
      (post.material.toLowerCase().includes(filters.material.toLowerCase()) || !filters.material) &&
      
      // Filter by search query
      (post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       post.price.toLowerCase().includes(searchQuery.toLowerCase()) ||
       post.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      
      // Filter by price (ensure price is numeric and compared correctly)
      (filters.price ? price <= filterPrice : true) // Apply price filter only if set
    );
  });
  

  const totalPages = Math.ceil(filteredPaintings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPaintings = filteredPaintings.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>, field: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: e.target.value as string,
    }));
  };

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 3,
        boxShadow: 3,
        padding: 3.5,
        mb: 2,
        width: '95%',
        maxWidth: '10000px',
        maxHeight: '750px',
        margin: '0 auto',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5, mb: 8 }}>
        {/* Search and Filter Section */}
        <Box
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: 3,
            boxShadow: 3,
            padding: 3,
            mb: 3,
            width: '100%',
            maxWidth: '100000px',
            margin: '0 auto',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            {/* Search Bar */}
            <TextField
              id="outlined-basic"
              label="Search"
              variant="outlined"
              fullWidth
              sx={{ maxWidth: 400 }}
              value={searchQuery}
              onChange={handleSearchChange}
            />

            {/* Filter Dropdowns */}
            <FormControl fullWidth sx={{ maxWidth: 200 }}>
              <InputLabel>material</InputLabel>
              <Select
                value={filters.material}
                onChange={(e) => handleFilterChange(e, 'material')}
                label="Painting Technique"
              >
                <MenuItem value="">None</MenuItem>
              <MenuItem value="Oil Painting">Oil Painting</MenuItem>
              <MenuItem value="Acrylic">Acrylic</MenuItem>
              <MenuItem value="Watercolor">Watercolor</MenuItem>
              <MenuItem value="Digital Art">Digital Art</MenuItem>
              <MenuItem value="Mixed Media">Mixed Media</MenuItem>
              <MenuItem value="Pencil Drawing">Pencil Drawing</MenuItem>
              <MenuItem value="Charcoal">Charcoal</MenuItem>
              <MenuItem value="Pastel">Pastel</MenuItem>
              <MenuItem value="Ink">Ink</MenuItem>
              <MenuItem value="Sculpture">Sculpture</MenuItem>
              <MenuItem value="Tempera">Tempera</MenuItem>
              <MenuItem value="Fresco">Fresco</MenuItem>
              <MenuItem value="Gouache">Gouache</MenuItem>
              <MenuItem value="Encaustic">Encaustic</MenuItem>
              <MenuItem value="Spray Paint">Spray Paint</MenuItem>
              <MenuItem value="Linocut">Linocut</MenuItem>
              <MenuItem value="Woodcut">Woodcut</MenuItem>
              <MenuItem value="Etching">Etching</MenuItem>
              <MenuItem value="Lithography">Lithography</MenuItem>
              <MenuItem value="Screen Printing">Screen Printing</MenuItem>
              <MenuItem value="Collage">Collage</MenuItem>
              <MenuItem value="Mosaic">Mosaic</MenuItem>
              <MenuItem value="Glass Art">Glass Art</MenuItem>
              <MenuItem value="Ceramic">Ceramic</MenuItem>
              <MenuItem value="Metal Work">Metal Work</MenuItem>
              <MenuItem value="Photography">Photography</MenuItem>
              <MenuItem value="3D Printing">3D Printing</MenuItem>
              <MenuItem value="Textile Art">Textile Art</MenuItem>
              <MenuItem value="Paper Art">Paper Art</MenuItem>
              <MenuItem value="Installation">Installation</MenuItem>

              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ maxWidth: 200 }}>
              <InputLabel>Style</InputLabel>
              <Select
                value={filters.style}
                onChange={(e) => handleFilterChange(e, 'style')}
                label="Painting Style"
              >
                <MenuItem value="">None</MenuItem>
              <MenuItem value={1}>Abstract</MenuItem>
              <MenuItem value={2}>Realism</MenuItem>
              <MenuItem value={3}>Impressionism</MenuItem>
              <MenuItem value={4}>Expressionism</MenuItem>
              <MenuItem value={5}>Surrealism</MenuItem>
              <MenuItem value={6}>Pop Art</MenuItem>
              <MenuItem value={7}>Minimalism</MenuItem>
              <MenuItem value={8}>Contemporary</MenuItem>
              <MenuItem value={9}>Modern</MenuItem>
              <MenuItem value={10}>Traditional</MenuItem>
              <MenuItem value={11}>Baroque</MenuItem>
              <MenuItem value={12}>Renaissance</MenuItem>
              <MenuItem value={13}>Cubism</MenuItem>
              <MenuItem value={14}>Art Nouveau</MenuItem>
              <MenuItem value={15}>Art Deco</MenuItem>
              <MenuItem value={16}>Gothic</MenuItem>
              <MenuItem value={17}>Romanticism</MenuItem>
              <MenuItem value={18}>Neoclassicism</MenuItem>
              <MenuItem value={19}>Post-Impressionism</MenuItem>
              <MenuItem value={20}>Pointillism</MenuItem>
              <MenuItem value={21}>Fauvism</MenuItem>
              <MenuItem value={22}>Abstract Expressionism</MenuItem>
              <MenuItem value={23}>Color Field</MenuItem>
              <MenuItem value={24}>Op Art</MenuItem>
              <MenuItem value={25}>Kinetic Art</MenuItem>
              <MenuItem value={26}>Installation Art</MenuItem>
              <MenuItem value={27}>Performance Art</MenuItem>
              <MenuItem value={28}>Digital Art</MenuItem>
              <MenuItem value={29}>Street Art</MenuItem>
              <MenuItem value={30}>Folk Art</MenuItem>
              </Select>
            </FormControl>

            {/* Price Filter */}
            <FormControl fullWidth sx={{ maxWidth: 200 }}>
              <InputLabel>price</InputLabel>
              <Select
                value={filters.price}
                onChange={(e) => handleFilterChange(e, 'price')}
                label="Price"
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="100">Under 100</MenuItem>
                <MenuItem value="500">Under 500</MenuItem>
                <MenuItem value="1000">Under 1000</MenuItem>
                <MenuItem value="2000">Under 2000</MenuItem>
                <MenuItem value="5000">Under 5000</MenuItem>
                <MenuItem value="10000">Under 10000</MenuItem>
                <MenuItem value="20000">Under 20000</MenuItem>
                <MenuItem value="50000">Under 50000</MenuItem>
                <MenuItem value="100000">Under 100000</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : (
          <>
            <Card posts={currentPaintings} />

            {filteredPaintings.length > 0 && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  variant="outlined"
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Painting;
