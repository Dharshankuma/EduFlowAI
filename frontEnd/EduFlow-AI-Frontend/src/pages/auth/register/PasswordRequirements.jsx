import React from 'react';
import './PasswordRequirements.css';

export const PasswordRequirements = () => {
    const requirements = [
        { id: 1, text: 'At least 8 characters' },
        { id: 2, text: 'One lowercase letter' },
        { id: 3, text: 'One special character' },
        { id: 4, text: 'One uppercase letter' },
        { id: 5, text: 'One number' }
    ];

    const col1 = [requirements[0], requirements[1], requirements[2]];
    const col2 = [requirements[3], requirements[4]];

    return (
        <div className="password-requirements-container p-3 mb-4 text-start">
            <div className="row g-2">
                <div className="col-sm-6 d-flex flex-column gap-2">
                    {col1.map(req => (
                        <div key={req.id} className="requirement-item d-flex align-items-center">
                            <i className="bi bi-check-circle requirement-icon me-2"></i>
                            <span className="requirement-text">{req.text}</span>
                        </div>
                    ))}
                </div>
                <div className="col-sm-6 d-flex flex-column gap-2">
                    {col2.map(req => (
                        <div key={req.id} className="requirement-item d-flex align-items-center">
                            <i className="bi bi-check-circle requirement-icon me-2"></i>
                            <span className="requirement-text">{req.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
