import React, { useState, useEffect } from 'react';
import './pp.css';
import PostCard from './card';
import { Box, Pagination, CircularProgress } from '@mui/material';
import axios from 'axios';

interface Painting {
    painting_id: string;
    title: string;
    description: string;
    image: string ;
    creation_date: string;
    price: number ;
}

const BestPaintings: React.FC = () => {
    const [posts, setPosts] = useState<Painting[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://zaferuni.liara.run/api/painting/paintings/sorted-by-likes/', {
                params: { page: currentPage, limit: 4 },
            });

            setPosts(response.data.paintings);
            setTotalPages(response.data.pagination.totalPages);
        } catch (err) {
            console.error('Error fetching data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    return (
        <section className="paintings-section">
            <h2>Paintings</h2>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <div className="painting-grid">
                        <PostCard posts={posts} onShare={() => null} />
                    </div>

                    <Box mt={3} display="flex" justifyContent="center" className="pagination-container">
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
        </section>
    );
};

export default BestPaintings;
