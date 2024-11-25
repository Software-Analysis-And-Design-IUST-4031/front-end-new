import React from 'react';
import Button from './Button';
import './Header.css';
import { useNavigate } from 'react-router-dom'

const Header: React.FC = () => {
    const navigate = useNavigate();
    const handleSignUp = () => {
        navigate("/SignUp");
    };

    const handleSignIn = () => {
        navigate("/Login");
    };

    return (
        <header className="header">
            <h1 className="header-title">zaferouni</h1>
            <div className="header-buttons">
                <Button label="Sign Up" onClick={handleSignUp} styleType="primary" />
                <Button label="Sign In" onClick={handleSignIn} styleType="primary" />
            </div>
        </header>
    );
};

export default Header;
