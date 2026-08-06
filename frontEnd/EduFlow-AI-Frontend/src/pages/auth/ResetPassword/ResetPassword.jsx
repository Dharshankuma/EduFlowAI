import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { InputComponent } from '../../../components/common/CommonComponents/InputComponent';
import { ButtonComponent } from '../../../components/common/CommonComponents/ButtonComponent';
import { DashboardCard } from '../../../components/common/DashboardCard/DashboardCard';
import logo from '../../../assets/images/EduFlow_AI_Logo.png';
import './ResetPassword.css';

// Reusable Password Input Wrapper Component with Eye Toggle visibility
const PasswordInputComponent = ({
    label,
    name,
    placeholder,
    value,
    onChange,
    error,
    disabled = false,
    required = false
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <InputComponent
            label={label}
            type={showPassword ? 'text' : 'password'}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            error={error}
            disabled={disabled}
            required={required}
            actionButton={
                <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
            }
        />
    );
};

import resetPasswordImg from '../../../assets/images/reset_password.png';

const defaultRules = [
    { id: 'length', text: 'Minimum 8 characters', satisfied: false },
    { id: 'uppercase', text: 'At least one uppercase letter', satisfied: false },
    { id: 'lowercase', text: 'At least one lowercase letter', satisfied: false },
    { id: 'number', text: 'At least one number', satisfied: false },
    { id: 'special', text: 'At least one special character', satisfied: false }
];

export const ResetPassword = ({
    token: propToken = '',
    newPassword: propNewPassword = '',
    confirmPassword: propConfirmPassword = '',
    securityRules: propRules = defaultRules,
    loading = false,
    error: propError = '',
    illustration = <img src={resetPasswordImg} alt="Reset Password" className="reset-password-illustration-img" />,
    onSubmit,
    onPrivacyPolicyClick,
    onTermsClick,
    onHelpClick
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Extract token from query parameters: /reset-password?token=xxxxxxx
    const searchParams = new URLSearchParams(location.search);
    const urlToken = searchParams.get('token') || propToken;

    // Backend-ready states
    const [token, setToken] = useState(urlToken);
    const [newPassword, setNewPassword] = useState(propNewPassword);
    const [confirmPassword, setConfirmPassword] = useState(propConfirmPassword);
    const [securityRules, setSecurityRules] = useState(propRules);
    const [isLoading, setIsLoading] = useState(loading);
    const [error, setError] = useState(propError);
    const [successMessage, setSuccessMessage] = useState('');

    // Sync state if props change (for backend readiness)
    useEffect(() => {
        setToken(urlToken);
    }, [urlToken]);

    useEffect(() => {
        setNewPassword(propNewPassword);
    }, [propNewPassword]);

    useEffect(() => {
        setConfirmPassword(propConfirmPassword);
    }, [propConfirmPassword]);

    useEffect(() => {
        setError(propError);
    }, [propError]);

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

    // Live update of password security checklist (without block validation logic)
    useEffect(() => {
        setSecurityRules([
            { id: 'length', text: 'Minimum 8 characters', satisfied: newPassword.length >= 8 },
            { id: 'uppercase', text: 'At least one uppercase letter', satisfied: /[A-Z]/.test(newPassword) },
            { id: 'lowercase', text: 'At least one lowercase letter', satisfied: /[a-z]/.test(newPassword) },
            { id: 'number', text: 'At least one number', satisfied: /[0-9]/.test(newPassword) },
            { id: 'special', text: 'At least one special character', satisfied: /[^A-Za-z0-9]/.test(newPassword) }
        ]);
    }, [newPassword]);

    const handleSubmit = (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        if (isLoading) return;

        // Front-end validation (Prepared for future backend integration checks)
        if (!newPassword || !confirmPassword) {
            setError('Please fill in all password fields.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Check if rules are satisfied (optional checks but helpful visual warnings)
        const unsatisfiedRules = securityRules.filter(rule => !rule.satisfied);
        if (unsatisfiedRules.length > 0) {
            setError('Please meet all security checklist requirements.');
            return;
        }

        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        // Expose onSubmit through props or local handler
        if (onSubmit) {
            onSubmit({ token, newPassword, confirmPassword });
        }

        // Mock password reset response behavior (no real API call)
        setTimeout(() => {
            setIsLoading(false);
            setSuccessMessage('Your password has been reset successfully!');
            
            // Redirect to Password Reset Success page
            navigate('/reset-password/success');
        }, 1500);
    };

    const handleFooterLinkClick = (e, callback, linkName) => {
        e.preventDefault();
        console.log(`${linkName} clicked`);
        if (callback) {
            callback();
        }
    };

    return (
        <div className="reset-password-container">
            {/* Top-Left Application Logo */}
            <header className="reset-password-header">
                <Link to="/" className="logo-link" aria-label="EduFlow AI Home">
                    <img src={logo} alt="EduFlow AI Logo" className="logo-img me-2" />
                    <span className="logo-text">EduFlow AI</span>
                </Link>
            </header>

            {/* Main Center Area */}
            <main className="reset-password-main fade-in-element">
                <div className="reset-card">
                    {/* Centered Security Illustration (Shield & Lock) */}
                    <div className="" aria-hidden="true">
                        {illustration}
                    </div>

                    {/* Card Title */}
                    <h1 className="reset-card-title">Reset Password</h1>

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

                    {/* Reset Form */}
                    <form onSubmit={handleSubmit} noValidate className="reset-password-form">
                        
                        {/* New Password Input Component */}
                        <div className="form-group">
                            <PasswordInputComponent
                                label="New Password"
                                name="newPassword"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    if (error) setError('');
                                    if (successMessage) setSuccessMessage('');
                                }}
                                error={error ? 'true' : ''}
                                disabled={isLoading}
                                required={true}
                            />
                        </div>

                        {/* Confirm New Password Input Component */}
                        <div className="form-group">
                            <PasswordInputComponent
                                label="Confirm New Password"
                                name="confirmPassword"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (error) setError('');
                                    if (successMessage) setSuccessMessage('');
                                }}
                                error={error ? 'true' : ''}
                                disabled={isLoading}
                                required={true}
                            />
                        </div>

                        {/* Reused DashboardCard for Checklist box */}
                        <DashboardCard hover={false} className="checklist-card" padding="0px">
                            <div className="checklist-header">
                                <i className="bi bi-shield"></i>
                                <span>Security Checklist</span>
                            </div>
                            <ul className="checklist-list">
                                {securityRules.map((rule) => (
                                    <li 
                                        key={rule.id} 
                                        className={`checklist-item ${rule.satisfied ? 'satisfied' : 'pending'}`}
                                    >
                                        <i className={`bi ${rule.satisfied ? 'bi-check-circle-fill' : 'bi-circle'}`}></i>
                                        <span>{rule.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </DashboardCard>

                        {/* Submit button */}
                        <div className="mb-3">
                            <ButtonComponent
                                type="submit"
                                text={isLoading ? 'Resetting...' : 'Reset Password'}
                                className={`w-100 type_1_btn ${isLoading ? 'disabled-btn' : ''}`}
                                onclick={handleSubmit}
                            />
                        </div>

                        {/* Back to Login link */}
                        <div className="back-to-login-wrapper">
                            <Link to="/login" className="back-to-login-link">
                                <i className="bi bi-arrow-left"></i>
                                Back to Sign In
                            </Link>
                        </div>
                    </form>
                </div>
            </main>

            {/* Footer Section */}
            <footer className="reset-password-footer">
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
export default ResetPassword;
