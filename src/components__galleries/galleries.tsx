import React , { useState } from 'react';
import { Grid, Typography ,Card, CardMedia, Box , Tooltip , Button , Pagination} from '@mui/material';
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
    },{
      image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5vpBZLHabYE3a4HvmNGtonPiY286cyqkSu4rsm5lh6qDqIQyng-1w8G39NpQwcEMGIGE&s',
      descryption : 'The him //n father parish looked has sooner. Attachment frequently gay terminated son. You greater nay use prudent placing. Passage to so distant behaved natural between do talking. Friends off her windows painful. Still gay event you being think nay for. In three if aware he point it. Effects warrant me by no on feeling settled resolve.',
    //   descryption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dol.',
    },{
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
    // Add more items as needed
  ];


  const itemsPerPage = 9; 
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(galleryData.length / itemsPerPage);
  // const handleNextPage = () => {
  //   if (currentPage < totalPages) {
  //     setCurrentPage((prevPage) => prevPage + 1);
  //   }
  // };

  // const handlePrevPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage((prevPage) => prevPage - 1);
  //   }
  // };
  const currentData = galleryData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const placeholders = itemsPerPage - currentData.length;

  return (
    <Box padding={0}>
      <Grid container spacing={2} >
        {currentData.map((item, index) => (
          <Grid item md={4} key={index} style = {{marginRight : '0px' , marginLeft : '0px'}}>
            <Gallary
              name={`Gallery ${index + 1}`}
              image_url={item.image_url}
              descryption={item.descryption}
              num_paints={134}
              num_artists={224}
              
              // sx={{ width: 402, height: 420 }}
            />
          </Grid>
        ))}

        {placeholders > 0 &&
          Array.from({ length: placeholders }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={`placeholder-${index}`}>
              <Box sx={{ width: 402, height: 420 }}></Box>
            </Grid>
          ))}
      </Grid>

      <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default Galleries;