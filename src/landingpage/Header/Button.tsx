import React from 'react';

interface ButtonProps {
    label: string;
    onClick: () => void;
    styleType?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ label, onClick, styleType = 'primary' }) => {
    const buttonStyle = styleType === 'primary' ? 'button-primary' : 'button-secondary';

    return (
        <button className={`button ${buttonStyle}`} onClick={onClick}>
            {label}
        </button>
    );
};

export default Button;
