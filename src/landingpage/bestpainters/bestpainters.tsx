import React, { useState, useEffect } from 'react';
import './bestpainters.css';
import PostCard from './cardpainters';
import { Box, Pagination, CircularProgress } from '@mui/material';
import axios from 'axios';

interface Painter {
    id: string;
    imageUrl: string;
    artist: string;
    likes: number;
}

const itemsPerPage = 3; 

const mockSamples: Painter[] = [
    {
        id: '1',
        imageUrl: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8',
        artist: 'Vincent Van Gogh',
        likes: 10,
    },
    {
        id: '2',
        imageUrl: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5',
        artist: 'Leonardo da Vinci',
        likes: 50,
    },
    {
        id: '3',
        imageUrl: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8',
        artist: 'Salvador Dalí',
        likes: 15,
    },
];

const Painter: React.FC = () => {
    const [posts, setPosts] = useState<Painter[]>(mockSamples);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const totalPages = Math.ceil(posts.length / itemsPerPage);

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPainter = posts.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/paintings/');
                setPosts(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
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
                        <PostCard posts={currentPainter} />
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
