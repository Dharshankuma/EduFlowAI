import React from 'react';
import './SectionTitle.css';

export const SectionTitle = ({
    title,
    subtitle,
    center = false,
    description
}) => {
    return (
        <div className={`section-title-component ${center ? 'text-center' : ''}`}>
            {subtitle && <span className="section-title-subtitle">{subtitle}</span>}
            <h2 className="section-title-heading">{title}</h2>
            {description && <p className="section-title-description">{description}</p>}
        </div>
    );
};

export default SectionTitle;
