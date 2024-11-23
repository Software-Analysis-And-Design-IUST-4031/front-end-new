import React from 'react';
import './card.css' ;

interface CardProps {
    title: string;
    artist: string;
    year: number;
    style: string;
    price: number;
}

const Card: React.FC<CardProps> = ({ title, artist, year, style, price }) => {
    return (
        <div className="painting-card">
            <h3>{title}</h3>
            <p>Artist: {artist}</p>
            <p>Year: {year}</p>
            <p>Style: {style}</p>
            <p>Price: ${price}</p>
        </div>
    );
};

export default Card;
