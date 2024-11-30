import React, { useState } from 'react';
import './bestpaintings.css';
import pic from './d22.jpg';
import { Pagination, Box } from '@mui/material';

interface Painting {
  name: string;
  photo: string;
  description: string;
}

const bestPaintings: Painting[] = [
  { name: "Sunrise", photo: pic, description: "A breathtaking view of sunrise over the ocean." },
  { name: "The Forest", photo: pic, description: "A deep dive into the heart of an ancient forest." },
  { name: "City Lights", photo: pic, description: "A dazzling scene of a city skyline at night." },
  { name: "Desert Mirage", photo: pic, description: "A mesmerizing desert landscape under the scorching sun." },
  { name: "Mountain Escape", photo: pic, description: "A serene mountain scene with snow-capped peaks." }
];

const itemsPerPage = 2;

const BestPaintings: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(bestPaintings.length / itemsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPaintings = bestPaintings.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="description-section">
      <h2>List of the Best Paintings of the Month</h2>
      <div className="paintings-list">
        {currentPaintings.map((painting, index) => (
          <div key={index} className="painting">
            <img src={painting.photo} alt={painting.name} className="painting-photo" />
            <h3>{painting.name}</h3>
            <p>{painting.description}</p>
          </div>
        ))}
      </div>
      <Box mt={3} display="flex" justifyContent="center">
        <Pagination 
          count={totalPages} 
          page={currentPage} 
          onChange={handlePageChange} 
          variant="outlined" 
          color="primary" 
        />
      </Box>
    </section>
  );
};

export default BestPaintings;
