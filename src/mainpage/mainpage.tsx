import React from 'react';
import Title from './title/title';
import Mygif1 from './Animation/Animation';
import Paitings from './paintings/Paintings';
import Painter from './painters/painters';

const MainPage: React.FC = () => {
  return (
    <>
      
      <Title/>
      <Paitings/>
      <Mygif1 />
      <Painter />
      
    </>
  );
};

export default MainPage;
