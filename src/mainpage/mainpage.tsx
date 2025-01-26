import React from 'react';
import { motion } from 'framer-motion';
import Title from './title/title';
import Painter from './painters/painters';
import Painting from './paintings/Paintings';
import Mygif1 from './Animation/Animation';

const MainPage: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: '150px' }}>
        <Title />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ marginBottom: '150px', backgroundColor: '#ffffff', padding: '20px 0' }}
      >
        <Painter />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ marginBottom: '150px', backgroundColor: '#f5f5f5', padding: '300px 0' }}
      >
        <div style={{ maxWidth: '1500px', margin: '0 auto' }}>
          <Mygif1 />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ marginBottom: '100px', backgroundColor: '#ffffff', padding: '20px 0' }}
      >
        <Painting />
      </motion.div>
    </div>
  );
};

export default MainPage;