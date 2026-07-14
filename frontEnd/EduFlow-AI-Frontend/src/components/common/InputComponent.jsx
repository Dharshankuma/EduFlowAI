import React from 'react';
import './CommonComponent.css';

export const InputComponent = ({
    label,
    type = 'text',
    name,
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    required = false,
    disabled = false,
    helpText,
    className,
    icon,
    actionButton
}) => {

    const inputClass = `form-control ${error ? 'type1_textbox_error' : ''} ${className || ''}`.trim();
    const hasIcon = !!(icon || actionButton);

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

            <div className={`input-wrapper ${hasIcon ? 'has-icon' : ''}`}>
                <input
                    id={name}
                    type={type}
                    name={name}
                    className={inputClass}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    required={required}
                    disabled={disabled}
                />

                {actionButton ? (
                    actionButton
                ) : (
                    icon && (
                        <span className="input-icon">
                            {icon}
                        </span>
                    )
                )}
            </div>

            {helpText && (
                <div className="form-text mt-1">{helpText}</div>
            )}
        </div>
    );
};
