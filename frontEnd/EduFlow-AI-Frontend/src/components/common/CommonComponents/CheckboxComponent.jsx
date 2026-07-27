import React from 'react';
import './CommonComponent.css';

export const CheckboxComponent = ({
    label,
    name,
    checked,
    onChange,
    required = false,
    disabled = false,
    className = '',
    error
}) => {
    return (
        <div className={`form-check ${className}`}>
            <input
                className={`form-check-input ${error ? 'is-invalid' : ''}`}
                type="checkbox"
                name={name}
                id={name}
                checked={checked}
                onChange={onChange}
                required={required}
                disabled={disabled}
            />
            {label && (
                <label className="form-check-label ms-2" htmlFor={name} style={{ userSelect: 'none', cursor: 'pointer' }}>
                    {label}
                </label>
            )}

        </div>


    );
};
