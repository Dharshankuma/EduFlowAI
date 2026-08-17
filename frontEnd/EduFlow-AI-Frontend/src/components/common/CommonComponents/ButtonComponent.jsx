import React from 'react'
import './CommonComponent.css'
export const ButtonComponent = ({
    type,
    label,
    onclick,
    text,
    className,
    disabled,
    ...rest
}) => {
    return (
        <div className=''>
            <button type={type}
                className={className}
                onClick={onclick}
                disabled={disabled}
                {...rest}>
                {text}
            </button>
        </div>
    )
};
