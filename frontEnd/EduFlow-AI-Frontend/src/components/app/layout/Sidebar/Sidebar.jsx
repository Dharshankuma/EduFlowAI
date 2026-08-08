import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logoImage from '../../../../assets/images/EduFlow_AI_Logo.png';
import './Sidebar.css';
import { useAppState } from '../../../../context/StateContext';

export const Sidebar = () => {
    const navigate = useNavigate();
    const { currentUser } = useAppState();

    const mainNavItems = [
        { path: '/dashboard', label: 'Dashboard', icon: 'bi-grid-fill' },
        { path: '/goals', label: 'Goals', icon: 'bi-bullseye' },
        { path: '/calendar', label: 'Calendar', icon: 'bi-calendar3' },
        // { path: '/ai-planner', label: 'AI Planner', icon: 'bi-stars' },
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
                    {currentUser.profileImage ? (
                        <img src={currentUser.profileImage} alt={currentUser.userName} className="user-avatar-img" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                        <div className="user-avatar">
                            <span>{currentUser.firstName ? currentUser.firstName[0] : 'U'}</span>
                        </div>
                    )}
                </div>
                <div className="user-info">
                    <span className="user-name">{currentUser.firstName || 'User'}</span>
                    {/* <span className="user-badge">{currentUser.badge || 'Student'}</span> */}
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
