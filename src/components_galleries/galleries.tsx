import React , { useState } from 'react';
import { Grid, Typography ,Card, CardMedia, Box , Tooltip , Button} from '@mui/material';
import Gallary from './gallery';

const Galleries: React.FC = () => {
  const text : string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dol.'
  const galleryData = [
    {
      image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5vpBZLHabYE3a4HvmNGtonPiY286cyqkSu4rsm5lh6qDqIQyng-1w8G39NpQwcEMGIGE&s',
      descryption : 'The him //n father parish looked has sooner. Attachment frequently gay terminated son. You greater nay use prudent placing. Passage to so distant behaved natural between do talking. Friends off her windows painful. Still gay event you being think nay for. In three if aware he point it. Effects warrant me by no on feeling settled resolve.',
    //   descryption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dol.',
    },
    {
      image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5vpBZLHabYE3a4HvmNGtonPiY286cyqkSu4rsm5lh6qDqIQyng-1w8G39NpQwcEMGIGE&s',
      descryption : 'The him //n father parish looked has sooner. Attachment frequently gay terminated son. You greater nay use prudent placing. Passage to so distant behaved natural between do talking. Friends off her windows painful. Still gay event you being think nay for. In three if aware he point it. Effects warrant me by no on feeling settled resolve.',
    //   descryption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dol.',
    },
    {
      image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5vpBZLHabYE3a4HvmNGtonPiY286cyqkSu4rsm5lh6qDqIQyng-1w8G39NpQwcEMGIGE&s',
      descryption : 'The him //n father parish looked has sooner. Attachment frequently gay terminated son. You greater nay use prudent placing. Passage to so distant behaved natural between do talking. Friends off her windows painful. Still gay event you being think nay for. In three if aware he point it. Effects warrant me by no on feeling settled resolve.',
    //   descryption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dol.',
    },
    {
      image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5vpBZLHabYE3a4HvmNGtonPiY286cyqkSu4rsm5lh6qDqIQyng-1w8G39NpQwcEMGIGE&s',
      descryption : 'The him //n father parish looked has sooner. Attachment frequently gay terminated son. You greater nay use prudent placing. Passage to so distant behaved natural between do talking. Friends off her windows painful. Still gay event you being think nay for. In three if aware he point it. Effects warrant me by no on feeling settled resolve.',
    //   descryption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dol.',
    },
    {
      image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5vpBZLHabYE3a4HvmNGtonPiY286cyqkSu4rsm5lh6qDqIQyng-1w8G39NpQwcEMGIGE&s',
      descryption : 'The him //n father parish looked has sooner. Attachment frequently gay terminated son. You greater nay use prudent placing. Passage to so distant behaved natural between do talking. Friends off her windows painful. Still gay event you being think nay for. In three if aware he point it. Effects warrant me by no on feeling settled resolve.',
    //   descryption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dol.',
    },
    {
      image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5vpBZLHabYE3a4HvmNGtonPiY286cyqkSu4rsm5lh6qDqIQyng-1w8G39NpQwcEMGIGE&s',
      descryption : 'The him //n father parish looked has sooner. Attachment frequently gay terminated son. You greater nay use prudent placing. Passage to so distant behaved natural between do talking. Friends off her windows painful. Still gay event you being think nay for. In three if aware he point it. Effects warrant me by no on feeling settled resolve.',
    //   descryption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dol.',
    },
    {
      image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5vpBZLHabYE3a4HvmNGtonPiY286cyqkSu4rsm5lh6qDqIQyng-1w8G39NpQwcEMGIGE&s',
      descryption : 'The him //n father parish looked has sooner. Attachment frequently gay terminated son. You greater nay use prudent placing. Passage to so distant behaved natural between do talking. Friends off her windows painful. Still gay event you being think nay for. In three if aware he point it. Effects warrant me by no on feeling settled resolve.',
    //   descryption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dol.',
    },
    {
      image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5vpBZLHabYE3a4HvmNGtonPiY286cyqkSu4rsm5lh6qDqIQyng-1w8G39NpQwcEMGIGE&s',
      descryption : 'The him //n father parish looked has sooner. Attachment frequently gay terminated son. You greater nay use prudent placing. Passage to so distant behaved natural between do talking. Friends off her windows painful. Still gay event you being think nay for. In three if aware he point it. Effects warrant me by no on feeling settled resolve.',
    //   descryption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dol.',
    },
    {
      image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5vpBZLHabYE3a4HvmNGtonPiY286cyqkSu4rsm5lh6qDqIQyng-1w8G39NpQwcEMGIGE&s',
      descryption : 'The him //n father parish looked has sooner. Attachment frequently gay terminated son. You greater nay use prudent placing. Passage to so distant behaved natural between do talking. Friends off her windows painful. Still gay event you being think nay for. In three if aware he point it. Effects warrant me by no on feeling settled resolve.',
    //   descryption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dol.',
    },
    {
      image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5vpBZLHabYE3a4HvmNGtonPiY286cyqkSu4rsm5lh6qDqIQyng-1w8G39NpQwcEMGIGE&s',
      descryption : 'The him //n father parish looked has sooner. Attachment frequently gay terminated son. You greater nay use prudent placing. Passage to so distant behaved natural between do talking. Friends off her windows painful. Still gay event you being think nay for. In three if aware he point it. Effects warrant me by no on feeling settled resolve.',
    //   descryption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dol.',
    },
    {
      image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwNCAhmYPPtqEFzGVd3YzV0K9biTLO0PDbQw&s',
      descryption : text + text,
    //   descryption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      image_url: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
      descryption : text ,
      // descryption: 'This is the third gallery item.',
    },
    {
      image_url: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
      descryption : text ,
      // descryption: 'This is the fourth gallery item.',
    },
    {
      image_url: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
      descryption : text ,
      // descryption: 'This is the fourth gallery item.',
    },
    {
      image_url: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
      descryption: 'This is the fourth gallery item.',
    },
    {
      image_url: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
      descryption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      image_url: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
      descryption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      image_url: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
      descryption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      image_url: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
      descryption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      image_url: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
      descryption : 'hello'
      // descryption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    // Add more items as needed
  ];


  const itemsPerPage = 9; 
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(galleryData.length / itemsPerPage);
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  const currentData = galleryData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const placeholders = itemsPerPage - currentData.length;

  return (
    <div className="galleries" style={{ overflowY: 'scroll' , padding : '30px'}}>
      <Grid container spacing={3} >
        {currentData.map((item, index) => (
          <Grid item xs={4} key={index}>
            <Gallary 
              name={`Galleryalleryalleryalleryalleryalleryalleryalleryalleryalleryalleryalleryalleryalleryalleryallery ${index}`}
              image_url={item.image_url}
              descryption={item.descryption}
              num_paints = {134}
              num_artists = {224}
            />
          </Grid>
          
        ))}

        {placeholders > 0 &&
        Array.from({ length: placeholders }).map((_, index: number) => (
          <Grid item xs={4} key={`placeholder-${index}`}>
            <Box sx={{ width: 402, height: 420}}></Box>
          </Grid>
        ))}
      </Grid>
      <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
        <Button 
          variant="contained" 
          onClick={handlePrevPage} 
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        
        <Typography variant="h6" sx={{ marginX: 2 }}>
          Page {currentPage} of {totalPages}
        </Typography>
        
        <Button 
          variant="contained" 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Box>
    </div>
  );
};

export default Galleries;