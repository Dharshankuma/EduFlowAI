import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppState } from '../../../../context/StateContext';
import { InputComponent } from '../../../common/CommonComponents/InputComponent';
import './Topbar.css';

// Calculate appropriate greeting based on local time
const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) {
        return 'Good Morning';
    }
    if (hour >= 12 && hour < 16) {
        return 'Good Afternoon';
    }
    if (hour >= 16 && hour < 20) {
        return 'Good Evening';
    }
    return 'Good Night';
};

export const Topbar = ({ onToggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, notifications, theme, toggleTheme } = useAppState();
    const [searchQuery, setSearchQuery] = useState('');
    const [greeting, setGreeting] = useState(() => getTimeGreeting());

    // Update greeting periodically so it updates automatically across time transitions
    useEffect(() => {
        const updateGreeting = () => {
            setGreeting(getTimeGreeting());
        };

        const intervalId = setInterval(updateGreeting, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const unreadCount = notifications.filter(n => n.unread).length;
    const isDashboard = location.pathname === '/dashboard';

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleNotificationClick = () => {
        navigate('/notifications');
    };

    const handleStudyNowClick = () => {
        window.dispatchEvent(new CustomEvent('open-study-now'));
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
                <h2 className="greeting-title">{greeting}, {currentUser.userName || currentUser.firstName || 'Dharshan'} 👋</h2>
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

                {/* {isDashboard && (
                    <button
                        className="topbar-study-now-btn"
                        onClick={handleStudyNowClick}
                        aria-label="Open Study Now drawer"
                        title="Study Now"
                    >
                        <i className="bi bi-book-half"></i>
                        <span>Study Now</span>
                    </button>
                )} */}

                <div className="topbar-buttons">
                    {/* <button
                        className="topbar-action-btn notification-btn"
                        onClick={handleNotificationClick}
                        aria-label="View notifications"
                        title="Notifications"
                    >
                        <i className="bi bi-bell"></i>
                        {unreadCount > 0 && (
                            <span className="notification-badge">{unreadCount}</span>
                        )}
                    </button> */}

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
