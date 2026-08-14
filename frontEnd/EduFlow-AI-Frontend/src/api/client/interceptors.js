import { getAccessToken, clearAuthData } from '../../utils/authStorage';
import { normalizeError } from './apiError';

// Callback to trigger AuthContext / App redirection on 401 (Unauthorized)
let onUnauthorizedCallback = null;

/**
 * Registers a callback to be executed when a 401 Unauthorized response is received.
 * @param {Function} callback - The callback function
 */
export const registerOnUnauthorized = (callback) => {
    onUnauthorizedCallback = callback;
};

/**
 * Request interceptor to attach bearer token to outgoing HTTP requests.
 * @param {Object} config - Axios request config
 * @returns {Object} Updated Axios request config
 */
export const requestInterceptor = (config) => {
    if (config.skipAuth) {
        return config;
    }
    const token = getAccessToken();
    if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
};

/**
 * Request error interceptor.
 * @param {Error} error - Request error
 * @returns {Promise} Rejected promise
 */
export const requestErrorInterceptor = (error) => {
    return Promise.reject(normalizeError(error));
};

/**
 * Response interceptor to handle successful responses.
 * @param {Object} response - Axios response
 * @returns {Object} Axios response
 */
export const responseInterceptor = (response) => {
    return response;
};

/**
 * Response error interceptor to handle 401 globally and normalize errors.
 * @param {Error} error - Axios error
 * @returns {Promise} Rejected promise
 */
export const responseErrorInterceptor = (error) => {
    if (error.response && error.response.status === 401) {
        // Clear authentication persistence data on authorization failure
        clearAuthData();

        // Notify callback if registered
        if (onUnauthorizedCallback) {
            onUnauthorizedCallback();
        }
    }
    return Promise.reject(normalizeError(error));
};
