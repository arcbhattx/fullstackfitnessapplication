import React from 'react';
import './Card.css'; // Import the CSS file for styling

const Card = ({ title, image, description }) => {
    return (
        <div className="card">
             <div className="card-content">
                <h2 className="card-title">{title}</h2>
                <p className="card-description">{description}</p>
            </div>
            <img src={image} alt={title} className="card-image" />
        </div>
    );
};

export default Card;