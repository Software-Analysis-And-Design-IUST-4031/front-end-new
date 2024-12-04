import React, { memo, Suspense, lazy , useEffect , useState} from 'react';
import { Box, Grid, Container, IconButton, Typography, useTheme, CircularProgress , Pagination } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useColorMode } from '../App';
import '../Themes.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Gallery = lazy(() => import('./gallery'));

// const galleryData = [
//   {
//     cover_image: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&w=800&q=75",
//     description: "A beautiful collection of contemporary art featuring works from emerging artists around the world. This gallery showcases diverse perspectives and innovative techniques in modern art.",
//     gallery_name: "Contemporary Collection",
//     number_of_paintings: 45,
//     number_of_artists: 12 ,
//     owner_id  : 1 , 
//   },
//   {
//     cover_image: "https://images.unsplash.com/photo-1577720580479-7d839d829c73?auto=format&w=800&q=75",
//     description: "Classical masterpieces from the Renaissance period, showcasing the timeless beauty of traditional art techniques and storytelling through visual media.",
//     gallery_name: "Renaissance Gallery",
//     number_of_paintings: 32,
//     number_of_artists: 8 ,
//     owner_id  : 1 
//   },
//   {
//     cover_image: "https://images.unsplash.com/photo-1574182245530-967d9b3831af?auto=format&w=800&q=75",
//     description: "Modern abstract expressions that challenge conventional art forms. This collection represents the cutting edge of contemporary artistic innovation.",
//     gallery_name: "Modern Abstract",
//     number_of_paintings: 28,
//     number_of_artists: 15 ,
//     owner_id  : 1 
//   }
// ];





import Galleries from './galleries';



interface Gallery_intefrace {
  cover_image: string;
  description: string;
  gallery_name: string;
  number_of_paintings: number;
  number_of_artists: number;
  owner_id: number;
  onClick ? : () => void;
}


// Memoize the theme toggle button to prevent unnecessary re-renders
const ThemeToggle = memo(({ mode, toggleColorMode }: { mode: string, toggleColorMode: () => void }) => (
  <IconButton
    onClick={toggleColorMode}
    color="inherit"
    sx={{
      position: 'fixed',
      top: 20,
      right: 20,
      bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      '&:hover': {
        bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
      },
      zIndex: 1300,
    }}
  >
    {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
  </IconButton>
));

const LoadingFallback = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      width: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      background: 'rgba(0,0,0,0.1)',
      backdropFilter: 'blur(8px)',
      zIndex: 1200,
    }}
  >
    <CircularProgress />
  </Box>
);

const GalleriesContainer: React.FC = () => {
  const theme = useTheme();
  const { toggleColorMode, mode } = useColorMode();
  const [loading , setLoading] = useState(false);
  const [error , setError] = useState(false);
  const [data , setData] = useState<Gallery_intefrace[]>([]) ;
  const [currentData , setCurretData] = useState<Gallery_intefrace[]>([]);
  const itemsPerPage = 3 ; 
  const placeholders = itemsPerPage - currentData.length;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const navigate = useNavigate(); 
  const handlePageChange = (event : React.ChangeEvent<unknown> , page: number) => {
    setCurrentPage(page);
  };


  useEffect(() =>
  {
      const getData = async () =>
      {
          setLoading(true);
          try
          {
              const response = await axios.get('http://127.0.0.1:8000/api/galleries/');
              const baseURL = 'http://127.0.0.1:8000';
              response.data = response.data.map(
              (gallery : Gallery_intefrace) =>
                  ({
                      ...gallery , 
                      cover_image: `${baseURL}${gallery.cover_image}`,
                      
                      // cover_image : 'http://127.0.0.1:8000/media/paintings/cat_QuxFppF.webp',
                  })
                  
              );
              setData(response.data);
              response.data.forEach((gallery : any) => {  
                console.log(gallery.cover_image);  
              })
          }
          catch (error)
          {
              setError(true) ;
          }
          finally
          {
              setLoading(false);
          }
      }
      getData();
  } ,
  [])


  useEffect(() => 
  {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setCurretData(data.slice(startIndex , endIndex)) ;
  } 
  , 
  [currentPage , data])


  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.background.default,
        backgroundImage: mode === 'dark' 
          ? 'radial-gradient(circle at 50% 50%, rgba(37, 38, 43, 0.87) 0%, rgba(18, 18, 23, 0.95) 100%)'
          : 'radial-gradient(circle at 50% 50%, rgba(250, 250, 252, 0.87) 0%, rgba(246, 246, 248, 0.95) 100%)',
        borderRadius: '32px 32px 0 0',
        margin: '0 auto',
        maxWidth: '1200px',
        width: '100%',
        border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)'}`,
        boxShadow: mode === 'dark' 
          ? '0 25px 70px -15px rgba(0,0,0,0.7)'
          : '0 25px 70px -15px rgba(0,0,0,0.25)',
      }}
    >
      <ThemeToggle mode={mode} toggleColorMode={toggleColorMode} />
      
      <Container maxWidth="xl" sx={{ pt: 8, pb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6, p: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              mb: 2,
              color: theme.palette.text.primary,
              fontWeight: 700,
              letterSpacing: '-0.5px',
              opacity: 0,
              animation: 'fadeIn 0.8s ease-out forwards',
            }}
          >
            Art Galleries
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: theme.palette.text.secondary,
              maxWidth: '800px',
              margin: '0 auto',
              fontWeight: 400,
              opacity: 0,
              animation: 'fadeIn 0.8s ease-out 0.2s forwards',
            }}
          >
            Explore our curated collection of exceptional artworks from talented artists around the world
          </Typography>
        </Box>
        
        {error ?  (
          <Grid 
            container  
            justifyContent="center"
          >
            <Typography
              variant = 'h4' 
            
            >
              can not display galleries
            </Typography>

          </Grid>



        ) : (
          <>
            <Grid 
              container 
              spacing={4} 
              justifyContent="center"
            >
              
              <Suspense fallback={<LoadingFallback />}>
                {currentData.map((gallery, index) => (
                  <Grid 
                    item 
                    key={index}
                  >
                    <Gallery
                      {...gallery}
                      // cover_image={gallery.cover_image}
                      // description={gallery.description}
                      // gallery_name={gallery.gallery_name}
                      // number_of_paintings={gallery.number_of_paintings}
                      // number_of_artists={gallery.number_of_artists}
                      // owner_id={gallery.owner_id}
                      index={index}
                      onclick_gallery={() => navigate(`/profile`)}
                    />
                  </Grid>
                ))}
              </Suspense>
            </Grid>
            <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
              <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  variant="outlined"
                  color="primary"
              />
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default memo(GalleriesContainer);
