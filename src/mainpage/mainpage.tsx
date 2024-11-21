import React from 'react';
import Header from './Header/Header';
import Footer from '../landingpage/footer/footer';
import Title from './title/title';
import Bestpainters from './bestpainters/bestpainters';
import Mygif1 from './Animation/Animation';
import Paitings from './paintings/Paitings';

const MainPage: React.FC = () => {
  return (
    <>
      <Header />
      <Title/>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Mygif1 />
            <Bestpainters/>
            
      </div>
      <Paitings/>
      <Footer />
    </>
  );
};

export default MainPage;
