import React, { useState, useEffect } from 'react';
import Navbar from './Header/Header';
import DescriptionSection from './description/description';
import Footer from './footer/footer';
import MyLottieAnimation1 from './animation/Animation1';
import MyLottieAnimation2 from './animation/Animation2';
import Features from './features/Features';
import Painter from './bestpainters/bestpainters';
import BestPaintings from './bestpaintings/bestpaintings';


const LandingPage: React.FC = () => {
  const [showAnimation, setShowAnimation] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="landing-page">
      {showAnimation ? (
        <MyLottieAnimation1 />
      ) : (
        <>
          <Navbar />
          <DescriptionSection />
          <MyLottieAnimation2 />
          <Painter />
          <BestPaintings />
          <Features />
          
          <Footer />
        </>
      )}
    </div>
  );
};

export default LandingPage;
