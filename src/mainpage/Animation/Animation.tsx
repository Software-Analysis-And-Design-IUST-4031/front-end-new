import React from 'react';
import './Animation.css';
import mygif from './paintings.webp'; 

const Mygif1: React.FC = () => {
  return (
    <div className="animation-con">  
      <img src={mygif} alt="Art Shop Animation" />
    </div>
  );
};

export default Mygif1;
