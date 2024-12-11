import React, { useState, useEffect } from 'react';
import './pp.css';
import PostCard from './card';
import { Box, Pagination, CircularProgress } from '@mui/material';
import axios from 'axios';
import img255 from './d22.jpg';

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

const itemsPerPage = 4;

const mockSamples: Painting[] = [
    {
        id: '1',
        imageUrl: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8',
        caption: 'A stunning masterpiece by Van Gogh',
        title: 'Starry Night',
        price: '5000',
        likes: 1,
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
        likes: 50,
        createdAt: new Date().toISOString(),
        artist: 'Leonardo da Vinci',
        year: 1503,
        style: 'Renaissance',
    },
    {
        id: '3',
        imageUrl: img255,
        caption: 'A surrealist masterpiece',
        title: 'The Persistence of Memory',
        price: '7000',
        likes: 15,
        createdAt: new Date().toISOString(),
        artist: 'Salvador Dalí',
        year: 1931,
        style: 'Surrealism',
    },
    {
        id: '4',
        imageUrl: 'https://via.placeholder.com/150',
        caption: 'Vibrant and colorful.',
        title: 'Color Explosion',
        price: '$400',
        likes: 180,
        createdAt: '2023-09-10',
        artist: 'David Brown',
        year: 2023,
        style: 'Abstract',
    },
];

const BestPaintings: React.FC = () => {
    const [posts, setPosts] = useState<Painting[]>(mockSamples);
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
                const response = await axios.get('https://zaferuni.liara.run/api/painting/paintings/sorted-by-likes/');
                setPosts(response.data);
            } catch (err) {
                console.error('Error fetching data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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
                        <PostCard posts={currentPaintings} onShare={() => null} />
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
