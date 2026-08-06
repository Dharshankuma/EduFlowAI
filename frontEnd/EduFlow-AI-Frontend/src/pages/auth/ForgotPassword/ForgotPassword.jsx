import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { InputComponent } from '../../../components/common/CommonComponents/InputComponent';
import { ButtonComponent } from '../../../components/common/CommonComponents/ButtonComponent';
import logo from '../../../assets/images/EduFlow_AI_Logo.png';
import './ForgotPassword.css';

export const ForgotPassword = ({
    email: propEmail = '',
    loading: propLoading = false,
    error: propError = '',
    onSubmit,
    onContactSupport,
    onPrivacyPolicyClick,
    onTermsClick,
    onHelpClick
}) => {
    const navigate = useNavigate();

    // Local state prepared for ASP.NET Core integration / validation
    const [email, setEmail] = useState(propEmail);
    const [isLoading, setIsLoading] = useState(propLoading);
    const [error, setError] = useState(propError);
    const [successMessage, setSuccessMessage] = useState('');

    // Sync state if props change (for backend readiness)
    useEffect(() => {
        setEmail(propEmail);
    }, [propEmail]);

    useEffect(() => {
        setIsLoading(propLoading);
    }, [propLoading]);

    useEffect(() => {
        setError(propError);
    }, [propError]);

    // Handle body class on mount/unmount to support full-page auth design overrides
    useEffect(() => {
        document.body.classList.add('auth-page');
        return () => {
            document.body.classList.remove('auth-page');
        };
    }, []);

    // Form submission handler
    const handleSubmit = (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        if (isLoading) return;

        // Front-end email structure validation check (prepared for backend error state)
        if (!email) {
            setError('Email address is required.');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        // Expose onSubmit callback if provided in props
        if (onSubmit) {
            onSubmit({ email });
        }

        // Mock password reset response behavior (no real API call)
        setTimeout(() => {
            setIsLoading(false);
            setSuccessMessage('A password reset link has been sent to your email address.');
            navigate('/forgot-password/success', { state: { email } });
        }, 1500);
    };

    const handleContactSupport = (e) => {
        e.preventDefault();
        console.log('Contact Support clicked');
        if (onContactSupport) {
            onContactSupport();
        }
    };

    const handleFooterLinkClick = (e, callback, linkName) => {
        e.preventDefault();
        console.log(`${linkName} clicked`);
        if (callback) {
            callback();
        }
    };

    return (
        <div className="forgot-password-container">
            {/* Top-Left Application Logo */}
            <header className="forgot-password-header">
                <Link to="/" className="logo-link" aria-label="EduFlow AI Home">
                    <img src={logo} alt="EduFlow AI Logo" className="logo-img me-2" />
                    <span className="logo-text">EduFlow AI</span>
                </Link>
            </header>

            {/* Main Area with Card and Contact Support */}
            <main className="forgot-password-main fade-in-element">
                <div className="forgot-password-card">
                    {/* Centered Mail Icon */}
                    <div className="icon-wrapper">
                        <i className="bi bi-envelope"></i>
                    </div>

                    {/* Card Headers */}
                    <h1 className="card-title">Forgot your password?</h1>
                    <p className="card-description">
                        Enter your registered email address and we'll send you a password reset link.
                    </p>

                    {/* Mock Status Alerts */}
                    {error && (
                        <div className="alert alert-danger py-2 px-3 mb-3 text-start small w-100" role="alert">
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="alert alert-success py-2 px-3 mb-3 text-start small w-100" role="alert">
                            {successMessage}
                        </div>
                    )}

                    {/* Forgot Password Form */}
                    <form onSubmit={handleSubmit} noValidate className="forgot-password-form">
                        <div className="form-group mb-3">
                            <InputComponent
                                label="Email Address"
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (error) setError('');
                                    if (successMessage) setSuccessMessage('');
                                }}
                                error={error ? 'true' : ''}
                                disabled={isLoading}
                                required={true}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="mb-3">
                            <ButtonComponent
                                type="submit"
                                text={
                                    isLoading ? 'Sending...' : (
                                        <>
                                            Send Reset Link
                                            <i className="bi bi-arrow-right ms-2"></i>
                                        </>
                                    )
                                }
                                className={`w-100 type_1_btn ${isLoading ? 'disabled-btn' : ''}`}
                                onclick={handleSubmit}
                            />
                        </div>

                        {/* Divider Line */}
                        <div className="divider"></div>

                        {/* Return to login link */}
                        <div className="back-to-login">
                            <span>Remember your password?</span>
                            <Link to="/login" className="back-to-login-link">
                                Sign In
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Contact Support link */}
                <div className="support-link-wrapper">
                    <button 
                        type="button" 
                        onClick={handleContactSupport} 
                        className="support-link"
                        aria-label="Contact Support"
                    >
                        <i className="bi bi-question-circle"></i>
                        Contact Support
                    </button>
                </div>
            </main>

            {/* Sticky/Bottom Footer */}
            <footer className="forgot-password-footer">
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
