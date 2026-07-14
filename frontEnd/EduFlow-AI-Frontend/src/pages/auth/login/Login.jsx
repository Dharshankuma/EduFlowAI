import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { InputComponent } from '../../../components/common/InputComponent';
import { ButtonComponent } from '../../../components/common/ButtonComponent';
import { CheckboxComponent } from '../../../components/common/CheckboxComponent';
import loginImage from '../../../assets/images/login_image.png';
import logo from '../../../assets/images/EduFlow_AI_Logo.png';
import './Login.css';

// Inline Google SVG Icon for consistency and crispness
const GoogleIcon = () => (
    <svg className="google-icon-svg me-2" width="18" height="18" viewBox="0 0 18 18">
        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.909c1.702-1.567 2.683-3.874 2.683-6.615z" />
        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.909-2.258c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
        <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" />
        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.896 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961l3.007 2.332C4.672 5.164 6.656 3.58 9 3.58z" />
    </svg>
);

export const Login = () => {
    const navigate = useNavigate();

    // Form inputs state
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    // Error states
    const [errors, setErrors] = useState({});

    // Password visibility toggle
    const [showPassword, setShowPassword] = useState(false);

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

        // Email Validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        // Password Validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }

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
            // =========================================
            // PLACEHOLDER FOR AXIOS INTEGRATION
            // =========================================
            // const response = await axios.post('/api/auth/login', {
            //     email: formData.email,
            //     password: formData.password,
            //     rememberMe: formData.rememberMe
            // });
            //
            // // Store token and user data
            // localStorage.setItem('token', response.data.token);
            // navigate('/dashboard');
            // =========================================

            // Simulate API Call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('Login successful with:', formData);
            setApiSuccess('Login successful! Redirecting...');

            // Redirect simulation
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);

        } catch (err) {
            console.error('Login error:', err);
            setApiError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Social Login (Google)
    const handleGoogleLogin = () => {
        console.log('Google login clicked');
        // =========================================
        // PLACEHOLDER FOR AXIOS / OAUTH GOOGLE
        // =========================================
        // window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google`;
        // =========================================
    };

    return (
        <div className="login-page-container container-fluid p-0 overflow-hidden">
            <div className="row g-0 min-vh-100">
                {/* LEFT PANEL - Illustration & Marketing (50% Width) */}
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

                {/* RIGHT PANEL - Welcome & Login Form (55% Width) */}
                <div className="col-lg-6 col-12 d-flex flex-column justify-content-center align-items-center right-panel p-4 p-md-5">
                    <div className="form-container w-100 fade-in-element">

                        {/* Logo */}
                        <div className="logo-wrapper d-flex align-items-center mb-5">
                            <img src={logo} alt="EduFlow AI Logo" className="logo-img me-2" />
                            <span className="logo-text">EduFlow AI</span>
                        </div>

                        {/* Title and Subtitle */}
                        <div className="text-start mb-4">
                            <h2 className="welcome-title">Welcome Back!</h2>
                            <p className="welcome-subtitle">Sign in to continue your learning journey.</p>
                        </div>

                        {/* Status Messages */}
                        {apiError && <div className="alert alert-danger py-2 px-3 mb-3 text-start small">{apiError}</div>}
                        {apiSuccess && <div className="alert alert-success py-2 px-3 mb-3 text-start small">{apiSuccess}</div>}

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} noValidate className="login-form">

                            {/* Email Address */}
                            <div className="form-group mb-3 text-start">
                                <InputComponent
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    placeholder="name@university.edu"
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

                            {/* Password & Forgot Password */}
                            <div className="form-group mb-4 text-start">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <label className="form-label mb-0" htmlFor="password">
                                        Password<span className="mandatory_text_color ms-1">*</span>
                                    </label>
                                    <Link to="/" className="forgot-link text-decoration-none">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <InputComponent
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={errors.password ? 'true' : ''}
                                    autoComplete="current-password"
                                    disabled={isLoading}
                                    required={true}
                                    hasGroup={true}
                                    actionButton={
                                        <button
                                            type="button"
                                            className="btn password-toggle-btn"
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

                            {/* Remember Me */}
                            <div className="form-group mb-4 text-start">
                                <CheckboxComponent
                                    label="Remember Me"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Sign In Button */}
                            <div className="mb-4">
                                <ButtonComponent
                                    type="submit"
                                    text={isLoading ? 'Signing In...' : 'Sign In'}
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
                            <div className="mb-4">
                                <ButtonComponent
                                    type="button"
                                    onclick={handleGoogleLogin}
                                    text={<><GoogleIcon />Continue with Google</>}
                                    className="w-100 google-signin-btn"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Bottom Signup Prompt */}
                            <div className="signup-prompt text-center mt-4">
                                <span className="prompt-text">Don't have an account? </span>
                                <Link to="/register" className="signup-link text-decoration-none">
                                    Create Account
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
