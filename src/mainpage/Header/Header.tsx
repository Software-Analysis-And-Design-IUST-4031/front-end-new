import React, { useState } from 'react';
import Button from './Button';
import './Header.css';

const Header: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSignUp = () => {
        console.log('Sign up clicked');
    };

    const handleSignIn = () => {
        console.log('Sign in clicked');
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log('Search submitted for:', searchTerm);
    };

    return (
        <header className="header">
            <h1 className="header-title">Art Shop</h1>
            <div className="header-buttons">
                <Button label="Profile" onClick={handleSignUp} styleType="primary" />
                <Button label="Gallery" onClick={handleSignIn} styleType="primary" />
            </div>
            <div className="header-search">
                <form onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search artworks..."
                        className="search-input"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                    />
                </form>
            </div>
        </header>
    );
};

export default Header;
