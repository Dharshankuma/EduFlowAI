import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logoImage from '../../../../assets/images/EduFlow_AI_Logo.png';
import './MobileSidebar.css';

export const MobileSidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const mainNavItems = [
        { path: '/dashboard', label: 'Dashboard', icon: 'bi-grid-fill' },
        { path: '/goals', label: 'Goals', icon: 'bi-bullseye' },
        { path: '/tasks', label: 'Tasks', icon: 'bi-check2-square' },
        { path: '/calendar', label: 'Calendar', icon: 'bi-calendar3' },
        { path: '/ai-planner', label: 'AI Planner', icon: 'bi-lightning-charge-fill' },
        { path: '/analytics', label: 'Analytics', icon: 'bi-bar-chart-line-fill' },
    ];

    const bottomNavItems = [
        { path: '/profile', label: 'Profile', icon: 'bi-person-fill' },
        { path: '/settings', label: 'Settings', icon: 'bi-gear-fill' },
    ];

    const handleLogout = () => {
        onClose();
        navigate('/login');
    };

    const handleLinkClick = () => {
        onClose();
    };

    return (
        <div className={`mobile-sidebar-container ${isOpen ? 'open' : ''}`}>
            {/* Backdrop overlay */}
            <div 
                className="mobile-sidebar-overlay" 
                onClick={onClose} 
                aria-hidden="true"
            />
            
            {/* Drawer */}
            <div className="mobile-sidebar-drawer" role="dialog" aria-modal="true" aria-label="Navigation Menu">
                <div className="mobile-sidebar-header">
                    <div className="mobile-sidebar-brand">
                        <img src={logoImage} alt="EduFlow AI Logo" className="mobile-sidebar-logo" />
                        <span className="mobile-sidebar-brand-name">EduFlow AI</span>
                    </div>
                    <button 
                        className="mobile-sidebar-close-btn" 
                        onClick={onClose}
                        aria-label="Close menu"
                    >
                        <i className="bi bi-x"></i>
                    </button>
                </div>
                
                <hr className="mobile-sidebar-divider" />
                
                <nav className="mobile-sidebar-nav">
                    <div className="mobile-nav-section main-nav">
                        {mainNavItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `mobile-sidebar-nav-link ${isActive ? 'active' : ''}`}
                                onClick={handleLinkClick}
                                aria-label={item.label}
                            >
                                <i className={`bi ${item.icon} nav-icon`}></i>
                                <span className="nav-label">{item.label}</span>
                            </NavLink>
                        ))}
                    </div>

                    <div className="mobile-nav-section bottom-nav">
                        {bottomNavItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `mobile-sidebar-nav-link ${isActive ? 'active' : ''}`}
                                onClick={handleLinkClick}
                                aria-label={item.label}
                            >
                                <i className={`bi ${item.icon} nav-icon`}></i>
                                <span className="nav-label">{item.label}</span>
                            </NavLink>
                        ))}
                    </div>
                </nav>

                <div className="mobile-sidebar-user-card">
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
            </div>
        </div>
    );
};

export default MobileSidebar;
