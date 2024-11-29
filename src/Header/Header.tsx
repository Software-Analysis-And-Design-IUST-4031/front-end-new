import React from 'react';
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
            <h1 className="header-title">Art Shop</h1>
            <div className="header-buttons">
                <Button label="Sign Up" onClick={handleSignUp} styleType="primary" />
                <Button label="Sign In" onClick={handleSignIn} styleType="primary" />
            </div>
        </header>
    );
};

export default Header;
