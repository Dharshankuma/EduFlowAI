import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../../../context/StateContext';
import { InputComponent } from '../../../common/CommonComponents/InputComponent';
import './Topbar.css';

export const Topbar = ({ onToggleSidebar }) => {
    const navigate = useNavigate();
    const { currentUser, notifications, theme, toggleTheme } = useAppState();
    const [searchQuery, setSearchQuery] = useState('');

    const unreadCount = notifications.filter(n => n.unread).length;

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleNotificationClick = () => {
        navigate('/notifications');
    };

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
                <h2 className="greeting-title">Good Morning, {currentUser.firstName || 'Dharshan'} 👋</h2>
                <p className="greeting-subtitle">Ready to achieve today's study goals?</p>
            </div>

            {/* Right side: Search Box and Action Buttons */}
            <div className="topbar-actions">
                {/* <div className="topbar-search-wrapper">
                    <InputComponent
                        name="topbar-search"
                        placeholder="Search for goals..."
                        icon={<i className="bi bi-search"></i>}
                        className="topbar-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={() => {}}
                        // Capture key down events to perform search redirect on Enter key
                        onKeyDown={handleSearchKeyDown}
                        // To avoid linting/prop warnings, we let input-wrapper capture standard props
                    />
                </div> */}

                <div className="topbar-buttons">
                    <button
                        className="topbar-action-btn notification-btn"
                        onClick={handleNotificationClick}
                        aria-label="View notifications"
                        title="Notifications"
                    >
                        <i className="bi bi-bell"></i>
                        {unreadCount > 0 && (
                            <span className="notification-badge">{unreadCount}</span>
                        )}
                    </button>

                    <button
                        className="topbar-action-btn theme-toggle-btn"
                        onClick={toggleTheme}
                        aria-label={theme === 'dark' ? "Switch to light theme" : "Switch to dark theme"}
                        title={theme === 'dark' ? "Switch to light theme" : "Switch to dark theme"}
                    >
                        <i className={theme === 'dark' ? "bi bi-sun" : "bi bi-moon"}></i>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
