import React from 'react';
import { Grid } from '@mui/material';
import Gallery from './gallery';

interface GalleryItem {
  image_url: string;
  description: string;
  name: string;
  num_paints: number;
  num_artists: number;
}

const Galleries: React.FC = () => {
  const galleryData: GalleryItem[] = [
    {
      image_url: 'https://picsum.photos/800/600?random=1',
      description: 'A stunning collection of contemporary masterpieces showcasing modern artistic expression and creativity.',
      name: 'Modern Expressions',
      num_paints: 45,
      num_artists: 12
    },
    {
      image_url: 'https://picsum.photos/800/600?random=2',
      description: 'Classical art pieces that tell stories of historical significance and cultural heritage.',
      name: 'Classical Heritage',
      num_paints: 32,
      num_artists: 8
    },
    {
      image_url: 'https://picsum.photos/800/600?random=3',
      description: 'Abstract interpretations that challenge conventional perspectives and inspire new ways of thinking.',
      name: 'Abstract Visions',
      num_paints: 28,
      num_artists: 15
    }
  ];

  return (
    <>
      {/* {galleryData.map((gallery, index) => (
        <Grid item key={index}>
          <Gallery {...gallery} index={index} />
        </Grid>
      ))} */}
    </>
  );
};

export default Galleries;