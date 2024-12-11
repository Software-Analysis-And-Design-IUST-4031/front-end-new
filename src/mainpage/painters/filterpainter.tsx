import React from 'react';
import Select from 'react-select';
import './filterpainter.css';

interface Painter {
    id: string;
    imageUrl: string;
    artist: string;
    likes: number;
    
}

interface FilterProps {
    filters: { artist: string; search: string }; // Only artist and search filters
    handleFilterChange: (key: string, value: string) => void;
    mockPainters: Painter[]; // mockPainters prop stays as is
}

const Filter: React.FC<FilterProps> = ({ filters, handleFilterChange, mockPainters }) => {
    const uniqueArtists = Array.from(new Set(mockPainters.map((painting) => painting.artist)));

    const artistOptions = uniqueArtists.map((artist) => ({ value: artist, label: artist }));

    return (
        <div className="filters-container">
            <input
                type="text"
                placeholder="Search by title or artist..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="filter-input"
            />

            <Select
                value={filters.artist ? { value: filters.artist, label: filters.artist } : null}
                onChange={(selectedOption) => handleFilterChange('artist', selectedOption?.value || '')}
                options={artistOptions}
                placeholder="Search Artists"
                isSearchable
                className="filter-select"
            />
        </div>
    );
};

export default Filter;
