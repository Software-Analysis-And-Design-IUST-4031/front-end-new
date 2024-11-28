import React, { useState } from 'react';
import './bestpaintings.css';
import pic from './download.jpg';
import Button from './button'; 

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

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
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
      <div className="pagination-controls">
        <Button 
          label="Previous" 
          onClick={handlePrevPage} 
          styleType="primary" 
          disabled={currentPage === 1}
        />
        <span>Page {currentPage} of {totalPages}</span>
        <Button 
          label="Next" 
          onClick={handleNextPage} 
          styleType="primary" 
          disabled={currentPage === totalPages}
        />
      </div>
    </section>
  );
};

export default BestPaintings;
