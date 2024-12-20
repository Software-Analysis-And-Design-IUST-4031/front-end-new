import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SomeComponent = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/some-endpoint/`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {/* Render your component JSX here */}
    </div>
  );
};

export default SomeComponent; 