import React, { useState, useEffect } from 'react';
import Header from './Header/Header';
import DescriptionSection from './description/description';
import Footer from './footer/footer';
import MyLottieAnimation1 from './animation/Animation1';
import MyLottieAnimation2 from './animation/Animation2';
import Features from './features/Features';

const LandingPage: React.FC = () => {
  const [showAnimation, setShowAnimation] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col">
      {showAnimation ? (
        <MyLottieAnimation1 />
      ) : (
        <>
          <Header />
          <div className="w-full flex-1 flex flex-col md:flex-row justify-between items-center px-4 md:px-8">
            <DescriptionSection />
            <MyLottieAnimation2 />
          </div>
          <Features />
          <Footer />
        </>
      )}
    </div>
  );
};

export default LandingPage;
