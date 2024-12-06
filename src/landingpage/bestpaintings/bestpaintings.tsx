import React, { useState, useEffect } from 'react';
import './bestpaintings.css';
import PostCard from './card';
import { Box, Pagination, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';

interface Painting {
    id: string;
    imageUrl: string;
    caption: string;
    title: string;
    price: string;
    likes: number;
    createdAt: string;
    artist: string;
    year: number;
    style: string;
}

const itemsPerPage = 3; // Number of items to show per page

const mockSamples: Painting[] = [
    {
        id: '1',
        imageUrl: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8',
        caption: 'A stunning masterpiece by Van Gogh',
        title: 'Starry Night',
        price: '5000',
        likes: 10,  // Example like count
        createdAt: new Date().toISOString(),
        artist: 'Vincent Van Gogh',
        year: 1889,
        style: 'Post-Impressionism',
    },
    {
        id: '2',
        imageUrl: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5',
        caption: 'The enigmatic smile',
        title: 'Mona Lisa',
        price: '10000',
        likes: 50,  // Example like count
        createdAt: new Date().toISOString(),
        artist: 'Leonardo da Vinci',
        year: 1503,
        style: 'Renaissance',
    },
    {
        id: '3',
        imageUrl: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8',
        caption: 'A surrealist masterpiece',
        title: 'The Persistence of Memory',
        price: '7000',
        likes: 15,  // Example like count
        createdAt: new Date().toISOString(),
        artist: 'Salvador Dalí',
        year: 1931,
        style: 'Surrealism',
    },
];

const Paintings: React.FC = () => {
    const [posts, setPosts] = useState<Painting[]>(mockSamples); // Use mock samples initially
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const totalPages = Math.ceil(posts.length / itemsPerPage);

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPaintings = posts.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/paintings/');
                setPosts(response.data);  // Set posts to fetched data
            } catch (err) {
                // In case of an error, leave the mock data in place
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []); // Only run once when the component mounts

    return (
        <section className="paintings-section">
            <h2>Paintings</h2>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <div className="paintings-grid">
                        {/* Render PostCards using mock data or fetched data */}
                        <PostCard posts={currentPaintings} onShare={() => null} />
                    </div>

                    {/* Pagination Controls */}
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

export default Paintings;
