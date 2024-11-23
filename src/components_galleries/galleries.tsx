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
      image_url: 'https://source.unsplash.com/random/800x600?art,gallery,1',
      description: 'A stunning collection of contemporary masterpieces showcasing modern artistic expression and creativity.',
      name: 'Modern Expressions',
      num_paints: 45,
      num_artists: 12
    },
    {
      image_url: 'https://source.unsplash.com/random/800x600?art,gallery,2',
      description: 'Classical art pieces that tell stories of historical significance and cultural heritage.',
      name: 'Classical Heritage',
      num_paints: 32,
      num_artists: 8
    },
    {
      image_url: 'https://source.unsplash.com/random/800x600?art,gallery,3',
      description: 'Abstract interpretations that challenge conventional perspectives and inspire new ways of thinking.',
      name: 'Abstract Visions',
      num_paints: 28,
      num_artists: 15
    },
    {
      image_url: 'https://source.unsplash.com/random/800x600?art,gallery,4',
      description: 'A diverse collection of portraits capturing human emotions and stories through various artistic styles.',
      name: 'Portrait Collection',
      num_paints: 36,
      num_artists: 10
    },
    {
      image_url: 'https://source.unsplash.com/random/800x600?art,gallery,5',
      description: 'Impressionist works that capture the beauty of light, color, and momentary perceptions.',
      name: 'Impressionist Dreams',
      num_paints: 40,
      num_artists: 14
    },
    {
      image_url: 'https://source.unsplash.com/random/800x600?art,gallery,6',
      description: 'Contemporary sculptures and installations that redefine spatial art and dimensional expression.',
      name: 'Sculptural Space',
      num_paints: 25,
      num_artists: 9
    }
  ];

  return (
    <Grid container spacing={4} justifyContent="center">
      {galleryData.map((gallery, index) => (
        <Grid item key={index}>
          <Gallery
            {...gallery}
            index={index}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default Galleries;