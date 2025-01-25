import React from 'react';
import Title from './title/title';
import Painter from './painters/painters';
import Painting from './paintings/Paintings';
import Mygif1 from './Animation/Animation';

const MainPage: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: '50px' }}>
        <Title />
      </div>
      <div style={{ marginBottom: '50px' }}>
        <Painter />
      </div>
      <div style={{ marginBottom: '50px' }}>
        <Mygif1 />
      </div>
      <div>
        <Painting />
      </div>
    </div>
  );
};

export default MainPage;