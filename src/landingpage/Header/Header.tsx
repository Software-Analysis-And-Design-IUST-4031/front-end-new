import React from 'react';
import Button from './Button';
import './header.css'
import { useNavigate } from 'react-router-dom';
import logo from './black_on_trans.png'; 

const Header: React.FC = () => {
    const navigate = useNavigate();

    const handleSignUp = () => {
        navigate('/signup');
    };

    const handleSignIn = () => {
        console.log('Sign in clicked');
    };

    return (
        <header className="header">
            <img src={logo} alt="Logo" className="header-logo" />
            <div className="header-divider" />
            <div className="header-buttons">
                <Button label="Sign Up" onClick={handleSignUp} styleType="primary" />
                <Button label="Sign In" onClick={handleSignIn} styleType="primary" />
            </div>
        </header>
    );
};

export default Header;
