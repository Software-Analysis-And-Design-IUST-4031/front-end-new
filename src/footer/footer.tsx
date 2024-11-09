import React from 'react';
import './footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>Contact us: info@artshop.com</p>
                <p>Follow us on social media:</p>
                <p>Instagram: @artshop | Facebook: Art Shop</p>
            </div>
        </footer>
    );
};

export default Footer;
