import React from 'react';
import Header from '../landingpage/Header/Header';
import Footer from '../landingpage/footer/footer';
import Title from '../landingpage/title/title';
import Searchbar from './SearchBar/serach';

const MainPage: React.FC = () => {
  return (
    <>
      <Header />
      <Searchbar/>
      <Title/>
      <Footer />
    </>
  );
};

export default MainPage;
