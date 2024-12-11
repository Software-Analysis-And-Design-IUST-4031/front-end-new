import React, { useState, useEffect } from 'react';
import Filter from './filterpainter'; 
import './painters.css';
import PostCard from '../../landingpage/bestpainters/cardpainters';
import { Box, Pagination, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

interface Painter{
    id: string;
    imageUrl: string;
    artist: string;
    likes: number;
}

const itemsPerPage = 3;

const Paintings: React.FC = () => {
    const [posts, setPosts] = useState<Painter[]>([]);
    const [filters, setFilters] = useState({ style: '', artist: '', year: '', search: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Mock data instead of API call for testing
                const mockPainters: Painter[] = [
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
                setPosts(mockPainters);
            } catch (err) {
                console.error('Error fetching paintings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleFilterChange = (key: string, value: string) => {
        setFilters({ ...filters, [key]: value });
        setCurrentPage(1);
    };

    const filteredPaintings = posts.filter((painting) => {
        const matchesArtist = !filters.artist || painting.artist === filters.artist;
        const matchesSearch =
            !filters.search ||
            painting.artist.toLowerCase().includes(filters.search.toLowerCase());
        return   matchesArtist  && matchesSearch;
    });

    const totalPages = Math.ceil(filteredPaintings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPaintings = filteredPaintings.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    return (
        <section className="painter-section">

            <Filter filters={filters} handleFilterChange={handleFilterChange} mockPainters={posts} />

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <div className="painter-grid">
                        <PostCard posts={currentPaintings} />
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
