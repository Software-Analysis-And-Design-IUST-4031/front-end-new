import React, { useEffect, useState, useRef } from 'react';
import './FeatureBox.css';

interface FeatureBoxProps {
  title: string;
  description: string;
}

const FeatureBox: React.FC<FeatureBoxProps> = ({ title, description }) => {
  const [isInView, setIsInView] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting); 
      },
      { threshold: 0.5 } 
    );

    if (boxRef.current) {
      observer.observe(boxRef.current); 
    }

    return () => {
      if (boxRef.current) {
        observer.unobserve(boxRef.current); 
      }
    };
  }, []);

  return (
    <div
      ref={boxRef}
      className={`feature-box ${isInView ? 'in-view' : ''}`}
    >
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default FeatureBox;
