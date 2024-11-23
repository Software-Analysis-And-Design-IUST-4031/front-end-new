import React from 'react';
import './title.css';
import mygif from './paintings2.webp' ;

const Title: React.FC = () => {
  return (
    <div className="title-wrapper">
      <h2 className="title">Now you can explore our paintings and shops , have fun :))))) </h2>
      <div className="animation-container">
        <img src={mygif} alt="Art Shop Animation" />
      </div>
    </div>
  );
};

export default Title;
