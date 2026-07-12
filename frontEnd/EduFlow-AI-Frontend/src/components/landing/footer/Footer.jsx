import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer = () => {
    return (
        <footer className="landing_footer">
            <div className="container footer_container">
                <div className="footer_copyright">
                    © 2026 EduFlow AI. All rights reserved.
                </div>
                <nav className="footer_nav">
                    <Link to="/privacy" className="footer_link">
                        Privacy Policy
                    </Link>
                    <Link to="/terms" className="footer_link">
                        Terms of Service
                    </Link>
                    <Link to="/help" className="footer_link">
                        Help Center
                    </Link>
                </nav>
            </div>
        </footer>
    );
};
