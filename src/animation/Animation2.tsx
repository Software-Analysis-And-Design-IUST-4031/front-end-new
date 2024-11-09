import React from 'react';
import Lottie from 'lottie-react';
import myAnimation from './art.json';
import './Animation1.css/'

const MyLottieAnimation2: React.FC = () => {
  return (
    <div className="Animation">
      <Lottie
        animationData={myAnimation} 
        loop
      />
    </div>
  );
};

export default MyLottieAnimation2;
