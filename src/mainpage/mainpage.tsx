import React from 'react';
import Footer from '../landingpage/footer/footer';
import Title from './title/title';
import Mygif1 from './Animation/Animation';
import Paitings from './paintings/Paitings';

const MainPage: React.FC = () => {
  return (
    <>
      
      <Title/>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Mygif1 />
            
            
      </div>
      <Paitings/>
      <Footer />
    </>
  );
};

export default MainPage;
