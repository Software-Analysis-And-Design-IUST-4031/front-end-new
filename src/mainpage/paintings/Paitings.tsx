import React, { useState } from 'react';
import './Paitings.css';
import Filter from './filter';
import Card from './card';

const mockPaintings = [
    { id: 1, title: 'Starry Night', artist: 'Van Gogh', year: 1889, style: 'Post-Impressionism', price: 5000 },
    { id: 2, title: 'Mona Lisa', artist: 'Da Vinci', year: 1503, style: 'Renaissance', price: 10000 },
    { id: 3, title: 'The Persistence of Memory', artist: 'Dali', year: 1931, style: 'Surrealism', price: 7000 },
    { id: 4, title: 'The Scream', artist: 'Munch', year: 1893, style: 'Expressionism', price: 6000 },
];

const Paintings: React.FC = () => {
    const [filters, setFilters] = useState({ style: '', artist: '', year: '', search: '' });
    const [filteredPaintings, setFilteredPaintings] = useState(mockPaintings);

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);

        const filtered = mockPaintings.filter((painting) => {
            const matchesStyle = !newFilters.style || painting.style === newFilters.style;
            const matchesArtist = !newFilters.artist || painting.artist === newFilters.artist;
            const matchesYear = !newFilters.year || painting.year.toString() === newFilters.year;
            const matchesSearch =
                !newFilters.search ||
                painting.title.toLowerCase().includes(newFilters.search.toLowerCase()) ||
                painting.artist.toLowerCase().includes(newFilters.search.toLowerCase());

            return matchesStyle && matchesArtist && matchesYear && matchesSearch;
        });

        setFilteredPaintings(filtered);
    };

    return (
        <section className="paintings-section">
            <h2>Paintings</h2>

            <Filter filters={filters} handleFilterChange={handleFilterChange} mockPaintings={mockPaintings} />

            <div className="paintings-grid">
                {filteredPaintings.map((painting) => (
                    <Card
                        key={painting.id}
                        title={painting.title}
                        artist={painting.artist}
                        year={painting.year}
                        style={painting.style}
                        price={painting.price}
                    />
                ))}
            </div>
        </section>
    );
};

export default Paintings;
