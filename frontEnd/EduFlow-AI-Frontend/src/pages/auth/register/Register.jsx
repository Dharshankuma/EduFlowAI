import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import { register } from '../../../api/auth/authenticationApi';
import { loadAndInitGoogleGis } from '../../../utils/googleGis';
import { Link, useNavigate } from 'react-router-dom';
import { InputComponent } from '../../../components/common/CommonComponents/InputComponent';
import { ButtonComponent } from '../../../components/common/CommonComponents/ButtonComponent';
import { CheckboxComponent } from '../../../components/common/CommonComponents/CheckboxComponent';
import { PasswordRequirements } from './PasswordRequirements';
import loginImage from '../../../assets/images/login_image.png';
import logo from '../../../assets/images/EduFlow_AI_Logo.png';
import './Register.css';

// GoogleIcon is not required with GIS native renderButton

export const Register = () => {
    const navigate = useNavigate();
    const { googleLogin } = useAuth();
    const googleLoginInProgress = useRef(false);

    // Form inputs state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
    });

    // Error states
    const [errors, setErrors] = useState({});

    // Password visibility toggles
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Submission states (visual feedback for Axios integration)
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [apiSuccess, setApiSuccess] = useState('');

    // Toggle body class to override the root container width on mount/unmount
    useEffect(() => {
        document.body.classList.add('auth-page');
        return () => {
            document.body.classList.remove('auth-page');
        };
    }, []);

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear field-specific error as user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Client-side validations
    const validateForm = () => {
        const newErrors = {};

        // Full Name Validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required.';
        }

        // Email Validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required.';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Please enter a valid email address.';
            }
        }

        // Password Validation
        if (!formData.password) {
            newErrors.password = 'Password is required.';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long.';
        }

        // Confirm Password Validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password.';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }

        // Terms Agreement Validation
        // if (!formData.agreeToTerms) {
        //     newErrors.agreeToTerms = 'You must agree to the Terms of Service and Privacy Policy';
        // }

        return newErrors;
    };

    // Handle Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        setApiSuccess('');

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);

        try {
            const payload = {
                Username: formData.fullName.trim(),
                EmailId: formData.email.trim(),
                Password: formData.password,
                authProvider: 'Local'
            };

            await register(payload);

            const successMessage = 'Registration successful! Please check your email for verification.';
            toast.success(successMessage);
            setApiSuccess(successMessage);

            navigate('/email-verification', { state: { email: formData.email.trim() } });
        } catch (err) {
            console.error('Registration error:', err);
            const errorMessage = err.message || 'An error occurred during registration. Please try again.';
            setApiError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Set up Google Sign-In using Google Identity Services
    useEffect(() => {
        let isMounted = true;

        loadAndInitGoogleGis()
            .then((google) => {
                if (!isMounted) return;

                // Bind callback to window handler so that one-time GIS init triggers this component's active callback
                window.handleGoogleCredentialResponse = async (response) => {
                    if (googleLoginInProgress.current) return;
                    googleLoginInProgress.current = true;
                    setIsLoading(true);
                    setApiError('');
                    setApiSuccess('');

                    try {
                        await googleLogin(response.credential);
                        toast.success('Google login successful!');
                        setApiSuccess('Google login successful! Redirecting...');
                        navigate('/dashboard');
                    } catch (err) {
                        console.error('Google login error:', err);
                        const errorMessage = err.message || 'Unable to connect to the server. Please try again.';
                        setApiError(errorMessage);
                        toast.error(errorMessage);
                    } finally {
                        setIsLoading(false);
                        googleLoginInProgress.current = false;
                    }
                };

                // Render the official Google Identity Services button
                const btnContainer = document.getElementById('google-signin-btn-container');
                if (btnContainer) {
                    btnContainer.innerHTML = ''; // Prevents duplicate rendering in strict mode
                    google.accounts.id.renderButton(
                        btnContainer,
                        {
                            theme: 'outline',
                            size: 'large',
                            width: btnContainer.offsetWidth || 380,
                            text: 'continue_with',
                            shape: 'rectangular',
                            logo_alignment: 'left'
                        }
                    );
                }
            })
            .catch((err) => {
                console.error('Failed to load Google GIS:', err);
                setApiError(err.message || 'Failed to load Google Sign-In.');
            });

        return () => {
            isMounted = false;
            if (window.handleGoogleCredentialResponse) {
                window.handleGoogleCredentialResponse = null;
            }
        };
    }, [googleLogin, navigate]);

    return (
        <div className="register-page-container container-fluid p-0 overflow-hidden">
            <div className="row g-0 min-vh-100">
                {/* LEFT PANEL - Illustration & Marketing (50% Width, matching Login) */}
                <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-between left-panel p-5">

                    <div className="left-panel-content-group mx-auto my-auto w-100 d-flex flex-column align-items-center">
                        {/* Illustration Container */}
                        <div className="illustration-container position-relative d-flex justify-content-center align-items-center w-100">
                            {/* Background Decorative Glows */}
                            <div className="glow-circle glow-blue"></div>
                            <div className="glow-circle glow-purple"></div>
                            <div className="glow-circle glow-cyan"></div>

                            {/* Floating Decorative Dots */}
                            <div className="decor-dot dot-1"></div>
                            <div className="decor-dot dot-2"></div>
                            <div className="decor-dot dot-3"></div>

                            <img
                                src={loginImage}
                                alt="EduFlow AI Study Companion"
                                className="img-fluid illustration-img floating-illustration"
                                draggable="false"
                            />
                        </div>

                        {/* Marketing Content */}
                        <div className="marketing-content-wrapper text-start mt-4 px-3 w-100">
                            <h1 className="marketing-heading">
                                Plan Smarter.<br />
                                Learn Better.
                            </h1>
                            <p className="marketing-description">
                                Your AI-powered study companion that helps you plan efficiently,
                                stay consistent, and achieve your academic goals with confidence.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="left-panel-footer text-start mt-5 px-3">
                        <p className="footer-text">
                            &copy; 2026 EduFlow AI
                            <span className="footer-dot">•</span>
                            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
                            <span className="footer-dot">•</span>
                            <Link to="/terms" className="footer-link">Terms of Service</Link>
                            <span className="footer-dot">•</span>
                            <Link to="/support" className="footer-link">Support</Link>
                        </p>
                    </div>
                </div>

                {/* RIGHT PANEL - Create Account Form (50% Width, matching Login) */}
                <div className="col-lg-6 col-12 d-flex flex-column justify-content-center align-items-center right-panel p-4 p-md-5">
                    <div className="form-container w-100 fade-in-element">

                        {/* Logo */}
                        <div className="logo-wrapper d-flex align-items-center mb-4">
                            <img src={logo} alt="EduFlow AI Logo" className="logo-img me-2" />
                            <span className="logo-text">EduFlow AI</span>
                        </div>

                        {/* Title and Subtitle */}
                        <div className="text-start mb-4">
                            <h2 className="welcome-title">Create Your Account</h2>
                            <p className="welcome-subtitle">Start your AI-powered learning journey today.</p>
                        </div>

                        {/* Status Messages */}
                        {apiError && <div className="alert alert-danger py-2 px-3 mb-3 text-start small">{apiError}</div>}
                        {apiSuccess && <div className="alert alert-success py-2 px-3 mb-3 text-start small">{apiSuccess}</div>}

                        {/* Register Form */}
                        <form onSubmit={handleSubmit} noValidate className="login-form">

                            {/* Full Name */}
                            <div className="form-group mb-3 text-start">
                                <InputComponent
                                    label="User Name"
                                    type="text"
                                    name="fullName"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    error={errors.fullName ? 'true' : ''}
                                    autoComplete="name"
                                    disabled={isLoading}
                                    required={true}
                                />
                                {errors.fullName && (
                                    <div className="form-field-error-message mt-1 text-danger small">
                                        {errors.fullName}
                                    </div>
                                )}
                            </div>

                            {/* Email Address */}
                            <div className="form-group mb-3 text-start">
                                <InputComponent
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    placeholder="name@company.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={errors.email ? 'true' : ''}
                                    autoComplete="email"
                                    disabled={isLoading}
                                    required={true}
                                />
                                {errors.email && (
                                    <div className="form-field-error-message mt-1 text-danger small">
                                        {errors.email}
                                    </div>
                                )}
                            </div>

                            {/* Password */}
                            <div className="form-group mb-3 text-start">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <label className="form-label mb-0" htmlFor="password">
                                        Password<span className="mandatory_text_color ms-1">*</span>
                                    </label>
                                </div>
                                <InputComponent
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={errors.password ? 'true' : ''}
                                    autoComplete="new-password"
                                    disabled={isLoading}
                                    required={true}
                                    actionButton={
                                        <button
                                            type="button"
                                            className="input-icon-btn"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            disabled={isLoading}
                                        >
                                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                        </button>
                                    }
                                />
                                {errors.password && (
                                    <div className="form-field-error-message mt-1 text-danger small">
                                        {errors.password}
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="form-group mb-3 text-start">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <label className="form-label mb-0" htmlFor="confirmPassword">
                                        Confirm Password<span className="mandatory_text_color ms-1">*</span>
                                    </label>
                                </div>
                                <InputComponent
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    error={errors.confirmPassword ? 'true' : ''}
                                    autoComplete="new-password"
                                    disabled={isLoading}
                                    required={true}
                                    actionButton={
                                        <button
                                            type="button"
                                            className="input-icon-btn"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                            disabled={isLoading}
                                        >
                                            <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                        </button>
                                    }
                                />
                                {errors.confirmPassword && (
                                    <div className="form-field-error-message mt-1 text-danger small">
                                        {errors.confirmPassword}
                                    </div>
                                )}
                            </div>

                            {/* Reusable Password Requirements Component */}
                            <PasswordRequirements />

                            {/* Agree to Terms Checkbox */}
                            {/* <div className="form-group mb-4 text-start">
                                <CheckboxComponent
                                    label={
                                        <>
                                            I agree to the <Link to="/terms" className="signup-link text-decoration-none">Terms of Service</Link> and <Link to="/privacy" className="signup-link text-decoration-none">Privacy Policy</Link>.
                                        </>
                                    }
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    error={errors.agreeToTerms}
                                />
                            </div> */}

                            {/* Submit Button */}
                            <div className="mb-4">
                                <ButtonComponent
                                    type="submit"
                                    text={isLoading ? 'Creating Account...' : 'Create Account'}
                                    className="w-100 type_1_btn signin-submit-btn"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Divider */}
                            <div className="divider-container d-flex align-items-center my-4">
                                <div className="divider-line flex-grow-1"></div>
                                <span className="divider-text mx-3">OR</span>
                                <div className="divider-line flex-grow-1"></div>
                            </div>

                            {/* Social Login Button */}
                            <div className="mb-4 d-flex justify-content-center">
                                <div id="google-signin-btn-container" className="w-100" style={{ minHeight: '40px' }}></div>
                            </div>

                            {/* Bottom Sign-In Prompt */}
                            <div className="signup-prompt text-center mt-4">
                                <span className="prompt-text">Already have an account? </span>
                                <Link to="/login" className="signup-link text-decoration-none">
                                    Sign In
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
