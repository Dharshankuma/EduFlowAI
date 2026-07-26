import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logoImage from '../../../../assets/images/EduFlow_AI_Logo.png';
import './Sidebar.css';

export const Sidebar = () => {
    const navigate = useNavigate();

    const mainNavItems = [
        { path: '/dashboard', label: 'Dashboard', icon: 'bi-grid-fill' },
        { path: '/goals', label: 'Goals', icon: 'bi-bullseye' },

        { path: '/calendar', label: 'Calendar', icon: 'bi-calendar3' },

        { path: '/analytics', label: 'Analytics', icon: 'bi-bar-chart-line-fill' },
    ];

    const bottomNavItems = [
        { path: '/profile', label: 'Profile', icon: 'bi-person-fill' },
        { path: '/settings', label: 'Settings', icon: 'bi-gear-fill' },
    ];

    const handleLogout = () => {
        // Simple mock logout action
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <img src={logoImage} alt="EduFlow AI Logo" className="sidebar-logo" />
                <span className="sidebar-brand-name">EduFlow AI</span>
            </div>

            <hr className="sidebar-divider" />

            <nav className="sidebar-nav">
                <div className="nav-section main-nav">
                    {mainNavItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                            aria-label={item.label}
                        >
                            <i className={`bi ${item.icon} nav-icon`}></i>
                            <span className="nav-label">{item.label}</span>
                        </NavLink>
                    ))}
                </div>

                <div className="nav-section bottom-nav">
                    {bottomNavItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                            aria-label={item.label}
                        >
                            <i className={`bi ${item.icon} nav-icon`}></i>
                            <span className="nav-label">{item.label}</span>
                        </NavLink>
                    ))}
                </div>
            </nav>

            <div className="sidebar-user-card">
                <div className="user-avatar-wrapper">
                    <div className="user-avatar">
                        <span>D</span>
                    </div>
                </div>
                <div className="user-info">
                    <span className="user-name">Dharshan</span>
                    <span className="user-badge">Premium Student</span>
                </div>
                <button
                    className="logout-btn"
                    onClick={handleLogout}
                    aria-label="Logout"
                    title="Logout"
                >
                    <i className="bi bi-box-arrow-right"></i>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
