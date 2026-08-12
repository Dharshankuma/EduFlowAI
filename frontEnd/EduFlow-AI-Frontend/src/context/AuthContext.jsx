import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authenticationApi from '../api/auth/authenticationApi';
import * as authStorage from '../utils/authStorage';
import { registerOnUnauthorized } from '../api/client/interceptors';

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
            setUser(null);
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
     * Client-side logout (clears state and local storage)
     */
    const logout = () => {
        authStorage.clearAuthData();
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isInitializing,
                login,
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
