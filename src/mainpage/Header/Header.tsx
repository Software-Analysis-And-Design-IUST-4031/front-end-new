import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import './Header.css';

const Header: React.FC = () => {
    const navigate = useNavigate();

    const handleSignUp = () => {
        setTimeout(() => {navigate("/profile")}, 1400);
    };

    const handleSignIn = () => {
        setTimeout(() => {navigate("/galleries")}, 1400);
    };


    return (
        <header className="header">
            <h1 className="header-title">zaferouni</h1>
            <div className="header-buttons">
                <Button label="Profile" onClick={handleSignUp} styleType="primary" />
                <Button label="Gallery" onClick={handleSignIn} styleType="primary" />
            </div>
           
            
        </header>
    );
};

export default Header;
