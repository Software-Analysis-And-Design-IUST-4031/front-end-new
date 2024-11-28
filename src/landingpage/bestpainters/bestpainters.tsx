import React, { useState } from 'react';
import './bestpainters.css';
import pic from './download.jpg';
import Button from './button'; 

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

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPainters = bestPainters.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="description-section">
      <h2>List of the Best Painters of the Month</h2>
      <div className="painters-list">
        {currentPainters.map((painter, index) => (
          <div key={index} className="painter">
            <img src={painter.photo} alt={painter.name} className="painter-photo" />
            <h3>{painter.name}</h3>
            <p>{painter.description}</p>
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

export default Bestpainters;
