import React, { useState } from 'react';
import logo from '../../../assets/images/EduFlow_AI_Logo.png'
import { Link } from 'react-router-dom';
import './Navbar.css';
import { ButtonComponent } from '../../common/CommonComponents/ButtonComponent';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(prev => !prev);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <nav className="landing_navbar">
            <div className="container">
                <div className="navbar_wrapper">
                    {/* Logo */}
                    <Link to="/" className="navbar_logo" onClick={closeMenu}>
                        <div className="logo_box">
                            <img src={logo} alt="EduFlow AI Logo" />
                        </div>
                        <span className="logo_text">
                            EduFlow AI
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <ul className="navbar_menu">
                        <li>
                            <a href="#about">About</a>
                        </li>
                        <li>
                            <a href="#features">Features</a>
                        </li>
                        <li>
                            <a href="#how-it-works">How It Works</a>
                        </li>

                    </ul>

                    {/* Right Buttons */}
                    <div className="navbar_actions">
                        <Link
                            to="/login"
                            className="login_btn"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"

                        >
                            <ButtonComponent
                                text={"Get Started"}
                                type={"button"}
                                className={"type_1_btn"}

                            />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="menu_btn"
                        type="button"
                        onClick={toggleMenu}
                        aria-label="Toggle navigation menu"
                        aria-expanded={isOpen}
                    >
                        <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
                    </button>
                </div>

                {/* Custom Responsive Mobile Dropdown */}
                <div className={`mobile_dropdown ${isOpen ? 'show' : ''}`}>
                    <ul className="mobile_dropdown_menu">
                        <li>
                            <a href="#features" onClick={closeMenu}>Features</a>
                        </li>
                        <li>
                            <a href="#how-it-works" onClick={closeMenu}>How It Works</a>
                        </li>
                        <li>
                            <a href="#about" onClick={closeMenu}>About</a>
                        </li>
                    </ul>
                    <div className="mobile_dropdown_actions">
                        <Link
                            to="/login"
                            className="login_btn"
                            onClick={closeMenu}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="get-started-btn"
                            onClick={closeMenu}
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

