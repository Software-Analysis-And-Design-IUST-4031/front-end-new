import React, { useState, useEffect } from 'react';
import './paintings.css';
import PostCard from '../../landingpage/bestpaintings/card';
import { Box, Pagination, CircularProgress } from '@mui/material';

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

const Paintings: React.FC = () => {
    const [posts, setPosts] = useState<Painting[]>([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Mock data instead of API call for testing
                const mockPaintings: Painting[] = [
                    {
                        id: '1',
                        imageUrl: 'https://via.placeholder.com/150',
                        caption: 'A beautiful painting.',
                        title: 'Abstract Art',
                        price: '$500',
                        likes: 120,
                        createdAt: '2024-12-01',
                        artist: 'John Doe',
                        year: 2021,
                        style: 'Abstract',
                    },
                    {
                        id: '2',
                        imageUrl: 'https://via.placeholder.com/150',
                        caption: 'An amazing landscape.',
                        title: 'Mountain View',
                        price: '$750',
                        likes: 150,
                        createdAt: '2023-06-15',
                        artist: 'Jane Smith',
                        year: 2022,
                        style: 'Landscape',
                    },
                    {
                        id: '3',
                        imageUrl: 'https://via.placeholder.com/150',
                        caption: 'A stunning portrait.',
                        title: 'Portrait of a Woman',
                        price: '$1000',
                        likes: 200,
                        createdAt: '2022-11-20',
                        artist: 'Anna Lee',
                        year: 2021,
                        style: 'Portrait',
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
                setPosts(mockPaintings);
            } catch (err) {
                console.error('Error fetching paintings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredPaintings = posts.filter((painting) => {
        const searchLower = search.toLowerCase();
        return (
            painting.title.toLowerCase().includes(searchLower) ||
            painting.artist.toLowerCase().includes(searchLower)
        );
    });

    const totalPages = Math.ceil(filteredPaintings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPaintings = filteredPaintings.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    return (
        <section className="paintings-section">
            {/* Search Input */}
            <div className="filters-container">
                <input
                    type="text"
                    placeholder="Search "
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1); // Reset to the first page when searching
                    }}
                    className="filter-input"
                />
            </div>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <div className="paintings-grid">
                        <PostCard posts={currentPaintings} onShare={() => null} />
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

export default Paintings;
