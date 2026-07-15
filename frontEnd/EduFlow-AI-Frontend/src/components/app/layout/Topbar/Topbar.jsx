import React from 'react';
import { InputComponent } from '../../../common/InputComponent';
import './Topbar.css';

export const Topbar = ({ onToggleSidebar }) => {
    return (
        <header className="topbar">
            {/* Hamburger button visible only on mobile */}
            <button
                className="mobile-hamburger-btn"
                onClick={onToggleSidebar}
                aria-label="Open navigation menu"
            >
                <i className="bi bi-list"></i>
            </button>

            {/* Left side: Greeting */}
            <div className="topbar-greeting">
                <h2 className="greeting-title">Good Morning, Dharshan 👋</h2>
                <p className="greeting-subtitle">Ready to achieve today's study goals?</p>
            </div>

            {/* Right side: Search Box and Action Buttons */}
            <div className="topbar-actions">
                <div className="topbar-search-wrapper">
                    <InputComponent
                        name="topbar-search"
                        placeholder="Search for goals..."
                        icon={<i className="bi bi-search"></i>}
                        className="topbar-search-input"
                    />
                </div>

                <div className="topbar-buttons">
                    <button
                        className="topbar-action-btn notification-btn"
                        aria-label="View notifications"
                        title="Notifications"
                    >
                        <i className="bi bi-bell"></i>
                        <span className="notification-badge"></span>
                    </button>

                    <button
                        className="topbar-action-btn theme-toggle-btn"
                        aria-label="Toggle theme"
                        title="Theme Toggle"
                    >
                        <i className="bi bi-moon"></i>
                    </button>

                    {/* <div className="topbar-avatar" title="Dharshan's Profile">
                        <span>D</span>
                    </div> */}
                </div>
            </div>
        </header>
    );
};

export default Topbar;
