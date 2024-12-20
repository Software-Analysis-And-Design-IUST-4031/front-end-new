import React, { useState, useEffect } from 'react';
import './bestpainters.css';
import PostCard from './cardpainters';
import { Box, Pagination, CircularProgress } from '@mui/material';
import axios from 'axios';

interface Painter {
    user_id: string;
    username: string;
    profile_picture: string;
    total_likes: number;
}

const itemsPerPage = 3;

const Painter: React.FC = () => {
    const [posts, setPosts] = useState<Painter[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchPainters = async (page: number) => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/painters/', {
                params: { page, itemsPerPage },
            });
            setPosts(response.data.painters);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            console.error('Error fetching painters', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
        fetchPainters(page);
    };

    useEffect(() => {
        fetchPainters(currentPage);
    }, []);

    return (
        <section className="painter-section">
            <h2>Painters</h2>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <div className="painter-grid">
                        <PostCard posts={posts} />
                    </div>

                    <Box mt={3} display="flex" justifyContent="center">
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

export default Painter;
