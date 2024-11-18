import React from 'react';
import Lottie from 'lottie-react';
import myAnimation from './loading.json';
import './Animation1.css/'

const MyLottieAnimation1: React.FC = () => {
  return (
    <div className="Animation">
      <Lottie
        animationData={myAnimation} 
        loop
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default MyLottieAnimation1;
