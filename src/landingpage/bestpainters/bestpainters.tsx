import React, { useState } from 'react';
import { Box, Typography, Pagination } from '@mui/material';
import './bestpainters.css';
import pic from './download.jpg';

interface Painter {
  name: string;
  photo: string;
  description: string;
}

const bestPainters: Painter[] = [
  { name: "Mahdi", photo: pic, description: "Mahdi is known for his unique blending of colors and abstract styles." },
  { name: "Anna", photo: pic, description: "Anna's work explores deep emotional themes through vivid landscapes." },
  { name: "Taylor", photo: pic, description: "Taylor’s art is a journey through the contrasts of urban and nature." },
  { name: "Sophia", photo: pic, description: "Sophia's portraits capture the essence of human emotions." },
  { name: "Liam", photo: pic, description: "Liam’s work focuses on modern architecture and its impact on society." }
];

const itemsPerPage = 2;

const Bestpainters: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(bestPainters.length / itemsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPainters = bestPainters.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="description-section">
      <Typography variant="h4" align="center" gutterBottom>
        List of the Best Painters of the Month
      </Typography>
      <Box className="painters-list">
        {currentPainters.map((painter, index) => (
          <Box key={index} className="painter">
            <img src={painter.photo} alt={painter.name} className="painter-photo" />
            <Typography variant="h6">{painter.name}</Typography>
            <Typography>{painter.description}</Typography>
          </Box>
        ))}
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
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

export default Bestpainters;
