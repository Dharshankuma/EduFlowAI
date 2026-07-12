import React from 'react'

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
    hasGroup,
    actionButton
}) => {

    const inputclass = `form-control ${error ? 'type1_textbox_error' : ''} ${className}`.trim();

    return (
        <div className='mb-3'>
            {label && (
                <label className='form-label'>
                    {label}
                    {required && (
                        <span className='text-danger ms-1'>*</span>
                    )}
                </label>
            )}

            {hasGroup ? (
                <div className="input-group">

                    {icon && (
                        <span className="input-group-text">
                            {icon}
                        </span>
                    )}

                    <input
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

                    {actionButton}

                </div>
            ) : (
                <input
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
            )}
        </div>
    )
}
