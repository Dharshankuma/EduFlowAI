import React from 'react';
import './CommonComponent.css';

export const SelectComponent = ({
    label,
    name,
    value,
    onChange,
    options = [],
    required = false,
    disabled = false,
    error,
    helpText,
    className = ''
}) => {
    const selectClass = `form-select ${error ? 'is-invalid' : ''} ${className}`.trim();

    return (
        <div className="mb-3">
            {label && (
                <label className="form-label" htmlFor={name}>
                    {label}
                    {required && <span className="mandatory_text_color">*</span>}
                  </label>
            )}
            <select
                id={name}
                name={name}
                className={selectClass}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {helpText && <div className="form-text mt-1">{helpText}</div>}
        </div>
    );
};

export default SelectComponent;
