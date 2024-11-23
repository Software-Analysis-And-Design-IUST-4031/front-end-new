import React from 'react';
import Select from 'react-select';
import './filters.css';  

interface FilterProps {
    filters: { style: string; artist: string; year: string; search: string };
    handleFilterChange: (key: string, value: string) => void;
    mockPaintings: { style: string; artist: string; year: number; title: string }[];
}

const Filter: React.FC<FilterProps> = ({ filters, handleFilterChange, mockPaintings }) => {
    const uniqueStyles = Array.from(new Set(mockPaintings.map((painting) => painting.style)));
    const uniqueArtists = Array.from(new Set(mockPaintings.map((painting) => painting.artist)));
    const uniqueYears = Array.from(new Set(mockPaintings.map((painting) => painting.year.toString())));

    const styleOptions = uniqueStyles.map((style) => ({ value: style, label: style }));
    const artistOptions = uniqueArtists.map((artist) => ({ value: artist, label: artist }));
    const yearOptions = uniqueYears.map((year) => ({ value: year, label: year }));

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
                value={filters.style ? { value: filters.style, label: filters.style } : null}
                onChange={(selectedOption) => handleFilterChange('style', selectedOption?.value || '')}
                options={styleOptions}
                placeholder="Search Styles"
                isSearchable
                className="filter-select"
            />

            <Select
                value={filters.artist ? { value: filters.artist, label: filters.artist } : null}
                onChange={(selectedOption) => handleFilterChange('artist', selectedOption?.value || '')}
                options={artistOptions}
                placeholder="Search Artists"
                isSearchable
                className="filter-select"
            />

            <Select
                value={filters.year ? { value: filters.year, label: filters.year } : null}
                onChange={(selectedOption) => handleFilterChange('year', selectedOption?.value || '')}
                options={yearOptions}
                placeholder="Search Years"
                isSearchable
                className="filter-select"
            />
        </div>
    );
};

export default Filter;
