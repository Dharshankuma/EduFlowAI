import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authenticationApi from '../api/auth/authenticationApi';
import * as authStorage from '../utils/authStorage';
import { registerOnUnauthorized } from '../api/client/interceptors';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    // Initial auth restore from localStorage
    const initializeAuth = () => {
        try {
            if (authStorage.hasAuthData()) {
                const userData = authStorage.getUserData();
                setUser(userData);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Failed to restore authentication state:', error);
            authStorage.clearAuthData();
        } finally {
            setIsInitializing(false);
        }
    };

    // Initialize Auth state on mount
    useEffect(() => {
        initializeAuth();

        // Register 401 unauthorized interceptor callback to sync UI state
        registerOnUnauthorized(() => {
            setUser((currentUser) => {
                if (currentUser !== null) {
                    toast.error("Your session has expired. Please sign in again.");
                }
                return null;
            });
            setIsAuthenticated(false);
        });
    }, []);

    /**
     * Authenticate user with credentials (email, password)
     * @param {Object} credentials - The email and password
     */
    const login = async (credentials) => {
        try {
            const data = await authenticationApi.login(credentials);
            
            // Expected response payload contains Token, RefreshToken, UserData
            authStorage.setAuthData(data);
            
            // Set react states
            setUser(data.UserData || data.userData);
            setIsAuthenticated(true);
            
            return data;
        } catch (error) {
            // Throw the normalized error to be handled by the UI
            throw error;
        }
    };

    /**
     * Authenticate user with Google Credential token
     * @param {string} credential - The Google ID token
     */
    const googleLogin = async (credential) => {
        try {
            const data = await authenticationApi.googleLogin(credential);
            
            // Expected response payload contains Token, RefreshToken, UserData
            authStorage.setAuthData(data);
            
            // Set react states
            setUser(data.UserData || data.userData);
            setIsAuthenticated(true);
            
            return data;
        } catch (error) {
            // Throw the normalized error to be handled by the UI
            throw error;
        }
    };

    /**
     * Centralized logout (invalidates server-side session and cleans up local state)
     */
    const logout = async () => {
        const refreshTokenVal = authStorage.getRefreshToken();
        
        // Instantly clean up local storage and react state to make UI responsive
        authStorage.clearAuthData();
        setUser(null);
        setIsAuthenticated(false);

        if (refreshTokenVal) {
            try {
                await authenticationApi.logout(refreshTokenVal);
                toast.success("Logged out successfully.");
            } catch (error) {
                console.error('Backend logout failed:', error);
                // Fail silently on backend but still inform user they are logged out locally
                toast.success("Logged out successfully.");
            }
        } else {
            toast.success("Logged out successfully.");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isInitializing,
                login,
                googleLogin,
                logout,
                initializeAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
