import React from 'react';
import './CommonComponent.css';

export const TextAreaComponent = ({
    label,
    name,
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    required = false,
    disabled = false,
    rows = 3,
    helpText,
    className
}) => {
    const textAreaClass = `form-control ${error ? 'type1_textbox_error' : ''} ${className || ''}`.trim();

    return (
        <div className='mb-3'>
            {label && (
                <label className='form-label' htmlFor={name}>
                    {label}
                    {required && (
                        <span className='mandatory_text_color'>*</span>
                    )}
                </label>
            )}

            <textarea
                id={name}
                name={name}
                className={textAreaClass}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                required={required}
                disabled={disabled}
                rows={rows}
            />

            {helpText && (
                <div className="form-text mt-1">{helpText}</div>
            )}
        </div>
    );
};
