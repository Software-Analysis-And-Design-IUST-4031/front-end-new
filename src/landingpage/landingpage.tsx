import React, { useState, useEffect } from 'react';
import Header from './Header/Header';
import DescriptionSection from './description/description';
import Footer from './footer/footer';
import MyLottieAnimation1 from './animation/Animation1';
import MyLottieAnimation2 from './animation/Animation2';
import Features from './features/Features';
import Bestpainters from './bestpainters/bestpainters';
import Bestpaintings from './bestpaintings/bestpaintings';

const LandingPage: React.FC = () => {
  const [showAnimation, setShowAnimation] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {showAnimation ? (
        <MyLottieAnimation1 />
      ) : (
        <>
          <Header />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <DescriptionSection />
            <MyLottieAnimation2 />
          </div>
          <Bestpainters />
          <Bestpaintings/>
          <Features />
          
          <Footer />
        </>
      )}
    </div>
  );
};

export default LandingPage;
