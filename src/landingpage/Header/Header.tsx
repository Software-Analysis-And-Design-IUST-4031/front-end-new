import React from 'react';
import Button from './Button';  // Assuming Button component is styled and used properly
import './header.css';
import { useNavigate } from 'react-router-dom';
import logo from './black_on_trans.png';

const Header: React.FC = () => {
  const navigate = useNavigate();

  // Handle sign up navigation
  const handleSignUp = () => {
    navigate('/signup');
  };

  // Handle sign in action (potentially add modal or redirect to login page)
  const handleSignIn = () => {
    console.log('Sign in clicked');
    // For now, navigate to sign-in page
    navigate('/signin');
  };

  return (
    <header className="header">
      {/* Logo Section */}
      <img src={logo} alt="Logo" className="header-logo" />

      {/* Divider Line for separation */}
      <div className="header-divider" />

      {/* Buttons for Sign Up and Sign In */}
      <div className="header-buttons">
        <Button label="Sign Up" onClick={handleSignUp} styleType="secondary" />
        <Button label="Sign In" onClick={handleSignIn} styleType="secondary" />
      </div>
    </header>
  );
};

export default Header;
