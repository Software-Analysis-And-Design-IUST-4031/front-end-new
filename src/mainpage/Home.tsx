import React from 'react';
import MainPage from './mainpage';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <MainPage />
      <style>{`
        .home-container {
          min-height: 100vh;
          background-color: #FAFBFC;
        }
      `}</style>
    </div>
  );
};

export default Home;