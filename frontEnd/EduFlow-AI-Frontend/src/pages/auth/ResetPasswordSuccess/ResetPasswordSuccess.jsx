import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ButtonComponent } from '../../../components/common/CommonComponents/ButtonComponent';
import { DashboardCard } from '../../../components/common/DashboardCard/DashboardCard';
import successIllustration from '../../../assets/images/Success_Illustration.png';
import logo from '../../../assets/images/EduFlow_AI_Logo.png';
import './ResetPasswordSuccess.css';

const defaultSuccessItemsList = [
    { id: 1, text: "Your password has been updated successfully.", icon: "bi-check" },
    { id: 2, text: "All previous password reset links are now invalid.", icon: "bi-check" },
    { id: 3, text: "Keep your password secure and never share it with anyone.", icon: "bi-check" }
];

export const ResetPasswordSuccess = ({
    successItems = defaultSuccessItemsList,
    loading = false,
    illustration = <img src={successIllustration} alt="Password Reset Successfully" className="success-illustration-img" />,
    onPrivacyPolicyClick,
    onTermsClick,
    onHelpClick
}) => {
    const navigate = useNavigate();

    // Backend-ready local states
    const [items, setItems] = useState(successItems);
    const [isLoading, setIsLoading] = useState(loading);

    // Sync state if props change (for backend readiness)
    useEffect(() => {
        setItems(successItems);
    }, [successItems]);

    useEffect(() => {
        setIsLoading(loading);
    }, [loading]);

    // Handle body class for auth layouts
    useEffect(() => {
        document.body.classList.add('auth-page');
        return () => {
            document.body.classList.remove('auth-page');
        };
    }, []);

    const handleGoToSignIn = (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        navigate('/login');
    };

    const handleFooterLinkClick = (e, callback, linkName) => {
        e.preventDefault();
        console.log(`${linkName} clicked`);
        if (callback) {
            callback();
        }
    };

    return (
        <div className="reset-password-success-container">
            {/* Top-Left Application Logo */}
            <header className="reset-password-success-header">
                <Link to="/" className="logo-link" aria-label="EduFlow AI Home">
                    <img src={logo} alt="EduFlow AI Logo" className="logo-img me-2" />
                    <span className="logo-text">EduFlow AI</span>
                </Link>
            </header>

            {/* Main Content Area */}
            <main className="reset-password-success-main fade-in-element">
                <div className="success-card">
                    {/* Success Illustration (green check shield SVG) */}
                    <div className="" aria-hidden="true">
                        {illustration}
                    </div>

                    {/* Card Headers */}
                    <h1 className="success-card-title">Password Reset Successfully</h1>
                    <p className="success-card-description">
                        Your password has been successfully updated. You can now sign in to your EduFlow AI account using your new password.
                    </p>

                    {/* Reused DashboardCard for Success Info Panel */}
                    <DashboardCard hover={false} className="success-info-panel-card" padding="0px">
                        <ul className="success-info-panel-list">
                            {items.map((item) => (
                                <li key={item.id} className="success-info-panel-item">
                                    <i className={`bi ${item.icon}`}></i>
                                    <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </DashboardCard>

                    {/* Primary Action Button */}
                    <div className="w-100 mb-3">
                        <ButtonComponent
                            type="button"
                            text="Go to Sign In"
                            className="w-100 type_1_btn"
                            onclick={handleGoToSignIn}
                        />
                    </div>
                </div>
            </main>

            {/* Footer Section */}
            <footer className="reset-password-success-footer">
                <div className="footer-left">
                    &copy; 2024 EduFlow AI. All rights reserved.
                </div>
                <div className="footer-right">
                    <button
                        type="button"
                        onClick={(e) => handleFooterLinkClick(e, onPrivacyPolicyClick, 'Privacy Policy')}
                        className="footer-right-link"
                    >
                        Privacy Policy
                    </button>
                    <button
                        type="button"
                        onClick={(e) => handleFooterLinkClick(e, onTermsClick, 'Terms of Service')}
                        className="footer-right-link"
                    >
                        Terms of Service
                    </button>
                    <button
                        type="button"
                        onClick={(e) => handleFooterLinkClick(e, onHelpClick, 'Help Center')}
                        className="footer-right-link"
                    >
                        Help Center
                    </button>
                </div>
            </footer>
        </div>
    );
};
export default ResetPasswordSuccess;
