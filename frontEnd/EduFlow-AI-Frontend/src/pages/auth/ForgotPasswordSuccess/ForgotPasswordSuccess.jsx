import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ButtonComponent } from '../../../components/common/CommonComponents/ButtonComponent';
import { DashboardCard } from '../../../components/common/DashboardCard/DashboardCard';
import logo from '../../../assets/images/EduFlow_AI_Logo.png';
import successIllustration from '../../../assets/images/Success_Illustration_margin.png';
import './ForgotPasswordSuccess.css';

const defaultTipsList = [
    { id: 1, text: "Check your Spam or Junk folder.", icon: "bi-check2" },
    { id: 2, text: "Make sure you entered the correct email address.", icon: "bi-check2" },
    { id: 3, text: "The reset link will expire in 15 minutes.", icon: "bi-clock-history" }
];

export const ForgotPasswordSuccess = ({
    email = '',
    tips = defaultTipsList,
    loading = false,
    illustration = <img src={successIllustration} alt="Check Your Email" className="success-illustration-img" />,
    onResendEmail,
    onPrivacyPolicyClick,
    onTermsClick,
    onHelpClick
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get email passed through router state if available
    const passedEmail = location.state?.email || email;

    // Backend-ready states
    const [userEmail, setUserEmail] = useState(passedEmail);
    const [tipItems, setTipItems] = useState(tips);
    const [isResending, setIsResending] = useState(loading);
    const [statusMessage, setStatusMessage] = useState('');
    const [statusType, setStatusType] = useState(''); // 'success' or 'danger'

    // Sync state if props change (for backend readiness)
    useEffect(() => {
        setUserEmail(passedEmail);
    }, [passedEmail]);

    useEffect(() => {
        setTipItems(tips);
    }, [tips]);

    useEffect(() => {
        setIsResending(loading);
    }, [loading]);

    // Handle body class on mount/unmount for full-page auth background support
    useEffect(() => {
        document.body.classList.add('auth-page');
        return () => {
            document.body.classList.remove('auth-page');
        };
    }, []);

    // Resend email handler (mock behavior)
    const handleResend = (e) => {
        e.preventDefault();
        if (isResending) return;

        setIsResending(true);
        setStatusMessage('');

        if (onResendEmail) {
            onResendEmail({ email: userEmail });
        }

        // Mock password reset response behavior (no real API call)
        setTimeout(() => {
            setIsResending(false);
            setStatusType('success');
            setStatusMessage('A new password reset link has been successfully resent.');
        }, 1200);
    };

    const handleBackToLogin = (e) => {
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
        <div className="forgot-password-success-container">
            {/* Top-Left Application Logo */}
            <header className="forgot-password-success-header">
                <Link to="/" className="logo-link" aria-label="EduFlow AI Home">
                    <img src={logo} alt="EduFlow AI Logo" className="logo-img me-2" />
                    <span className="logo-text">EduFlow AI</span>
                </Link>
            </header>

            {/* Main Area with Centered Card */}
            <main className="forgot-password-success-main fade-in-element">
                <div className="success-card">
                    {/* Success Illustration (received via props / default SVG) */}
                    <div className="illustration-container" aria-hidden="true">
                        {illustration}
                    </div>

                    {/* Card Headers */}
                    <h1 className="success-card-title">Check Your Email</h1>
                    <p className="success-card-description">
                        We've sent a password reset link to your registered email address
                        {userEmail ? <strong> {userEmail}</strong> : ''}. Please check your inbox and follow
                        the instructions to reset your password.
                    </p>

                    {/* Status Alerts */}
                    {statusMessage && (
                        <div className={`alert alert-${statusType === 'success' ? 'success' : 'danger'} py-2 px-3 mb-3 text-start small w-100`} role="alert">
                            {statusMessage}
                        </div>
                    )}

                    {/* Reused DashboardCard for Information Panel */}
                    <DashboardCard hover={false} className="info-panel-card" padding="0px">
                        <div className="info-panel-header">
                            <i className="bi bi-envelope"></i>
                            <span>Didn't receive the email?</span>
                        </div>
                        <ul className="info-panel-list">
                            {tipItems.map((tip) => (
                                <li key={tip.id} className="info-panel-item">
                                    <i className={`bi ${tip.icon}`}></i>
                                    <span>{tip.text}</span>
                                </li>
                            ))}
                        </ul>
                    </DashboardCard>

                    {/* Primary Button */}
                    <div className="w-100 mb-3">
                        <ButtonComponent
                            type="button"
                            text="Back to Sign In"
                            className="w-100 type_1_btn"
                            onclick={handleBackToLogin}
                        />
                    </div>

                    {/* Simulation Link */}
                    <div className="w-100 mb-3">
                        <ButtonComponent
                            type="button"
                            text="Simulate Clicking Reset Link in Email"
                            className="w-100 btn btn-outline-primary"
                            onclick={() => navigate('/reset-password?token=mocktoken')}
                        />
                    </div>

                    {/* Resend Link */}
                    <div className="resend-prompt-wrapper">
                        <span>Didn't get an email?</span>
                        <button
                            type="button"
                            onClick={handleResend}
                            className="resend-link-btn"
                            disabled={isResending}
                        >
                            {isResending ? 'Resending...' : 'Resend Reset Email'}
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer Section */}
            <footer className="forgot-password-success-footer">
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
export default ForgotPasswordSuccess;
