import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import './Header.css';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const handleProfile = () => {
        navigate(`/${username}/profile`);
    };

    const handleGallery = () => {
        navigate(`/${username}/galleries`);
    };

    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <header className="header">
            <h1 className="header-title">zaferouni</h1>
            <div className="header-buttons">
                <Button label="Profile" onClick={handleProfile} styleType="primary" />
                <Button label="Gallery" onClick={handleGallery} styleType="primary" />
                <Button label="Login" onClick={handleLogin} styleType="primary" />
            </div>
        </header>
    );
};

export default Header;
