import React from 'react';
import './FeatureBox.css';

interface FeatureBoxProps {
  title: string;
  description: string;
}

const FeatureBox: React.FC<FeatureBoxProps> = ({ title, description }) => {
  return (
    <div className="feature-box">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default FeatureBox;
