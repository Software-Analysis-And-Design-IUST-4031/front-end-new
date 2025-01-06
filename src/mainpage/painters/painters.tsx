import React, { useState, useEffect } from 'react';
import { Box, Pagination, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem, TextField , InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Card from './cpainter'; // Import the new Card component

interface Post {
  user_id: string;
  username: string;
  firstname: string;
  lastname: string;
  description: string;
  image: string;
  favorite_painting: string;
  favorite_painting_style: string;
  favorite_painter: string;
  favorite_painting_technique : string ;
  city: string;
  country: string;
}

const itemsPerPage = 4;

const Painter: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    favorite_painting_style: '',
    favorite_painting_technique: '',
    favorite_painter: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://zaferuni.liara.run/api/users/search/');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        const mappedPosts = data.results.map((user: any) => ({
          user_id: user.user_id.toString(),
          username: user.username,
          firstname: user.firstname || '',
          lastname: user.lastname || '',
          description: user.description || '',
          image: user.profile_picture || 'https://via.placeholder.com/150',
          favorite_painting: user.favorite_painting || '',
          favorite_painting_style: user.favorite_painting_style || '',
          favorite_painter: user.favorite_painter || '',
          favorite_painting_technique: user.favorite_painting_technique || '', // Ensure this is added
          city: user.city || '',
          country: user.country || '',
        }));

        setPosts(mappedPosts);
      } catch (err) {
        console.error('Error fetching painters:', err);
        setError('Failed to load painters. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPaintings = posts.filter((post) => {
    return (
      post.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filters.favorite_painting_style && filters.favorite_painting_style !== '' ? post.favorite_painting_style.toLowerCase() === filters.favorite_painting_style.toLowerCase() : true) &&
      (filters.favorite_painting_technique && filters.favorite_painting_technique !== '' ? post.favorite_painting_technique.toLowerCase() === filters.favorite_painting_technique.toLowerCase() : true) &&
      (filters.favorite_painter && filters.favorite_painter !== '' ? post.favorite_painter.toLowerCase() === filters.favorite_painter.toLowerCase() : true) 
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
          backgroundColor: 'grey.50',
          borderRadius: 3,
          boxShadow: 3,
          padding: 3.5,
          mb: 2,
          width: '95%',
          maxWidth: '10000px',
          maxHeight : '750px',
          margin: '0 auto',
        }}
      >
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5, mb: 8 }}>
      {/* Search and Filter Section */}
      <Box
        sx={{
          backgroundColor: 'grey.50',
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
              sx={{
                maxWidth: 400,
                borderRadius: '20px', // Added more border radius
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px', // Applied to the input field itself
                },
              }}
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

          {/* Filter Dropdowns */}
          <FormControl fullWidth sx={{
              maxWidth: 200,
              borderRadius: '20px', // Added more border radius
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px', // Applied to the input field itself
              },
            }}>
            <InputLabel>Painting Technique</InputLabel>
            <Select
              value={filters.favorite_painting_technique}
              onChange={(e) => handleFilterChange(e, 'favorite_painting_technique')}
              label="Painting Technique"
              sx={{
                maxWidth: 200,
                borderRadius: '20px', // Added more border radius
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px', // Applied to the input field itself
                },
              }}
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
            <InputLabel>Painting Style</InputLabel>
            <Select
              value={filters.favorite_painting_style}
              onChange={(e) => handleFilterChange(e, 'favorite_painting_style')}
              label="Painting Style"
              sx={{
                maxWidth: 200,
                borderRadius: '20px', // Added more border radius
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px', // Applied to the input field itself
                },
              }}
            >
              <MenuItem value="">None</MenuItem>
                <MenuItem value="Abstract">Abstract</MenuItem>
                <MenuItem value="Realism">Realism</MenuItem>
                <MenuItem value="Impressionism">Impressionism</MenuItem>
                <MenuItem value="Expressionism">Expressionism</MenuItem>
                <MenuItem value="Surrealism">Surrealism</MenuItem>
                <MenuItem value="Pop Art">Pop Art</MenuItem>
                <MenuItem value="Minimalism">Minimalism</MenuItem>
                <MenuItem value="Contemporary">Contemporary</MenuItem>
                <MenuItem value="Modern">Modern</MenuItem>
                <MenuItem value="Traditional">Traditional</MenuItem>
                <MenuItem value="Baroque">Baroque</MenuItem>
                <MenuItem value="Renaissance">Renaissance</MenuItem>
                <MenuItem value="Cubism">Cubism</MenuItem>
                <MenuItem value="Art Nouveau">Art Nouveau</MenuItem>
                <MenuItem value="Art Deco">Art Deco</MenuItem>
                <MenuItem value="Gothic">Gothic</MenuItem>
                <MenuItem value="Romanticism">Romanticism</MenuItem>
                <MenuItem value="Neoclassicism">Neoclassicism</MenuItem>
                <MenuItem value="Post-Impressionism">Post-Impressionism</MenuItem>
                <MenuItem value="Pointillism">Pointillism</MenuItem>
                <MenuItem value="Fauvism">Fauvism</MenuItem>
                <MenuItem value="Abstract Expressionism">Abstract Expressionism</MenuItem>
                <MenuItem value="Color Field">Color Field</MenuItem>
                <MenuItem value="Op Art">Op Art</MenuItem>
                <MenuItem value="Kinetic Art">Kinetic Art</MenuItem>
                <MenuItem value="Installation Art">Installation Art</MenuItem>
                <MenuItem value="Performance Art">Performance Art</MenuItem>
                <MenuItem value="Digital Art">Digital Art</MenuItem>
                <MenuItem value="Street Art">Street Art</MenuItem>
                <MenuItem value="Folk Art">Folk Art</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ maxWidth: 200 }}>
            <InputLabel>Favorite Painter</InputLabel>
            <Select
              value={filters.favorite_painter}
              onChange={(e) => handleFilterChange(e, 'favorite_painter')}
              label="favorite painter"
              sx={{
                maxWidth: 200,
                borderRadius: '20px', // Added more border radius
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px', // Applied to the input field itself
                },
              }}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Leonardo da Vinci">Leonardo da Vinci</MenuItem>
              <MenuItem value="Vincent van Gogh">Vincent van Gogh</MenuItem>
              <MenuItem value="Pablo Picasso">Pablo Picasso</MenuItem>
              <MenuItem value="Claude Monet">Claude Monet</MenuItem>
              <MenuItem value="Rembrandt">Rembrandt</MenuItem>
              <MenuItem value="Michelangelo">Michelangelo</MenuItem>
              <MenuItem value="Salvador Dalí">Salvador Dalí</MenuItem>
              <MenuItem value="Gustav Klimt">Gustav Klimt</MenuItem>
              <MenuItem value="Frida Kahlo">Frida Kahlo</MenuItem>
              <MenuItem value="Andy Warhol">Andy Warhol</MenuItem>
              <MenuItem value="Georgia O'Keeffe">Georgia O'Keeffe</MenuItem>
              <MenuItem value="Johannes Vermeer">Johannes Vermeer</MenuItem>
              <MenuItem value="Paul Cézanne">Paul Cézanne</MenuItem>
              <MenuItem value="Wassily Kandinsky">Wassily Kandinsky</MenuItem>
              <MenuItem value="Henri Matisse">Henri Matisse</MenuItem>
              <MenuItem value="Jackson Pollock">Jackson Pollock</MenuItem>
              <MenuItem value="Edvard Munch">Edvard Munch</MenuItem>
              <MenuItem value="René Magritte">René Magritte</MenuItem>
              <MenuItem value="Diego Rivera">Diego Rivera</MenuItem>
              <MenuItem value="Gustav Courbet">Gustav Courbet</MenuItem>

              
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

export default Painter;