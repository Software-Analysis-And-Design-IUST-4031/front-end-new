import React, { useState } from 'react';
import Button from './Button';
import './Header.css';

const Header: React.FC = () => {

    const handleSignUp = () => {
        console.log('Sign up clicked');
    };

    const handleSignIn = () => {
        console.log('Sign in clicked');
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
