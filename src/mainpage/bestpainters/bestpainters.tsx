import React from 'react';
import './bestpainters.css';
import pic from './download.jpg'

interface Painter {
    name: string;
    photo: string;
    description: string;
}

const bestPainters: Painter[] = [
    {
        name: "Mahdi",
        photo: pic ,
        description: "bob is known for his unique blending of colors and abstract styles."
    },
    {
        name: "ejejhyehj",
        photo: pic ,
        description: "anna's work explores deep emotional themes through vivid landscapes."
    },
    {
        name: "fweibbewfie",
        photo: pic ,
        description: "taylor’s art is a journey through the contrasts of urban and nature."
    }
];

const Bestpainters: React.FC = () => {
    return (
        <section className="description-section">
            <h2>List of the Best Painters of the Month</h2>
            <div className="painters-list">
                {bestPainters.map((painter, index) => (
                    <div key={index} className="painter">
                        <img src={painter.photo} alt={painter.name} className="painter-photo" />
                        <h3>{painter.name}</h3>
                        <p>{painter.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Bestpainters;
