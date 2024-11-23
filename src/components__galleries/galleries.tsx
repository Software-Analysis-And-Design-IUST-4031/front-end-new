import React, { useState, useEffect } from 'react';
import { Grid, Box, Pagination, Typography } from '@mui/material';
import Gallary from './gallery';
import axios from 'axios';

interface Gallery2 {
  gallery_name: string;
  description: string;
  image_url: string;
  owner_id: number;
  number_of_paintings: number;
  number_of_artists: number;
}

const Galleries: React.FC = () => {
  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<Gallery2[]>([]);
  const [currentData, setCurrentData] = useState<Gallery2[]>([]);
  const placeholders = itemsPerPage - currentData.length;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);

      try {
        const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage
        if (!token) {
          throw new Error('Access token not found. Please log in.');
        }

        const response = await axios.get('http://127.0.0.1:8000/api/gallery/galleries', {
          headers: {
            Authorization: `Bearer ${token}`, // Use the token in headers
          },
        });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching galleries:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(data.length / itemsPerPage); // Calculate total pages
  useEffect(() => {
    // Paginate data based on current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCurrentData(data.slice(startIndex, endIndex));
  }, [data, currentPage]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {loading ? (
        <Typography variant="h6" align="center" color="textSecondary">
          Loading...
        </Typography>
      ) : error ? (
        <Typography variant="h6" align="center" color="error">
          Some error happened.
        </Typography>
      ) : (
        <>
          <Grid container spacing={4}>
            {currentData.map((item, index) => (
              <Grid item md={4} key={index} style={{ marginRight: '0', marginLeft: '0' }}>
                <Gallary
                  id_owner={item.owner_id}
                  name={item.gallery_name}
                  image_url={item.image_url}
                  descryption={item.description}
                  num_paints={item.number_of_paintings}
                  num_artists={item.number_of_artists}
                />
              </Grid>
            ))}

            {placeholders > 0 &&
              Array.from({ length: placeholders }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={`placeholder-${index}`}>
                  <Box sx={{ width: 390, height: 370 }}></Box>
                </Grid>
              ))}
          </Grid>

          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
              color="primary"
            />
          </Box>
        </>
      )}
    </div>
  );
};

export default Galleries;
