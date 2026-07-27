import React from 'react'
import './CommonComponent.css'
export const ButtonComponent = ({
    type,
    label,
    onclick,
    text,
    className
}) => {
    return (
        <div className=''>
            <button type={type}
                className={className}
                onClick={onclick}>
                {text}
            </button>
        </div>
    )
};
