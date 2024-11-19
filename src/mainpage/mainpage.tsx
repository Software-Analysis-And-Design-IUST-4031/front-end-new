import React from 'react';
import Header from './Header/Header';
import Footer from '../landingpage/footer/footer';
import Title from './title/title';
import SearchBar from './SearchBar/serach';

const MainPage: React.FC = () => {
  return (
    <>
      <Header />
      
      <Title/>
      <Footer />
    </>
  );
};

export default MainPage;
