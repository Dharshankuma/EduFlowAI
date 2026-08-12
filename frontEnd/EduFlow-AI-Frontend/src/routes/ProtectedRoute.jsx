import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route guard component for protecting authenticated application routes.
 */
export const ProtectedRoute = () => {
    const { isAuthenticated, isInitializing } = useAuth();

    // Show a clean loading spinner during initial authentication check
    if (isInitializing) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100 w-100">
                <div className="d-flex flex-column align-items-center">
                    <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                        <span className="visually-hidden">Initializing application...</span>
                    </div>
                    <p className="text-secondary small fw-medium">Loading EduFlow AI...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if user is not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Render protected route children
    return <Outlet />;
};

export default ProtectedRoute;
