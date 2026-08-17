import { getAccessToken, getRefreshToken, setAuthData, clearAuthData } from '../../utils/authStorage';
import { normalizeError } from './apiError';

// Reference to axiosClient to make requests without circular dependency issues
let axiosClientRef = null;

// Callback to trigger AuthContext / App redirection on 401 (Unauthorized)
let onUnauthorizedCallback = null;

// Callbacks to trigger global loading show/hide state
let showLoaderCallback = null;
let hideLoaderCallback = null;

// Shared promise for pending refresh token requests
let refreshPromise = null;

/**
 * Registers the axios client instance to be used for requests/retries.
 * @param {Object} client - The axios client instance
 */
export const setAxiosClientRef = (client) => {
    axiosClientRef = client;
};

/**
 * Registers a callback to be executed when a 401 Unauthorized response is received.
 * @param {Function} callback - The callback function
 */
export const registerOnUnauthorized = (callback) => {
    onUnauthorizedCallback = callback;
};

/**
 * Registers callbacks for showing and hiding the global loader.
 * @param {Function} show - The show callback
 * @param {Function} hide - The hide callback
 */
export const registerLoaderCallbacks = (show, hide) => {
    showLoaderCallback = show;
    hideLoaderCallback = hide;
};

/**
 * Helper to check if a request configuration belongs to a public or authentication route.
 * @param {Object} config - Axios request config
 * @returns {boolean} True if route is public or auth-only
 */
const isPublicOrAuthEndpoint = (config) => {
    if (config.skipAuth) return true;
    const url = config.url || '';
    return (
        url.includes('/Authentication/login') ||
        url.includes('/Authentication/GoogleLogin') ||
        url.includes('/Authentication/refresh-token') ||
        url.includes('/Authentication/register') ||
        url.includes('/Authentication/logout')
    );
};

/**
 * Request interceptor to attach bearer token to outgoing HTTP requests and show loader.
 * @param {Object} config - Axios request config
 * @returns {Object} Updated Axios request config
 */
export const requestInterceptor = (config) => {
    if (showLoaderCallback && !config.skipLoader) {
        showLoaderCallback();
    }
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
    if (hideLoaderCallback && !error.config?.skipLoader) {
        hideLoaderCallback();
    }
    return Promise.reject(normalizeError(error));
};

/**
 * Response interceptor to handle successful responses.
 * @param {Object} response - Axios response
 * @returns {Object} Axios response
 */
export const responseInterceptor = (response) => {
    if (hideLoaderCallback && !response.config?.skipLoader) {
        hideLoaderCallback();
    }
    return response;
};

/**
 * Response error interceptor to handle 401 globally, refresh tokens, retry failed requests, and normalize errors.
 * @param {Error} error - Axios error
 * @returns {Promise} Rejected promise
 */
export const responseErrorInterceptor = async (error) => {
    const originalRequest = error.config;
    const isUnauthorized = error.response && error.response.status === 401;
    const canRefresh = isUnauthorized && originalRequest && !originalRequest._retry && !isPublicOrAuthEndpoint(originalRequest);

    // If we can refresh, do NOT hide the loader yet to prevent loader flickering.
    if (hideLoaderCallback && !originalRequest?.skipLoader) {
        if (!canRefresh) {
            hideLoaderCallback();
        }
    }

    if (canRefresh) {
        originalRequest._retry = true;

        try {
            // Get or create shared refresh promise to prevent duplicate requests
            if (!refreshPromise) {
                const rToken = getRefreshToken();
                if (!rToken) {
                    throw new Error('No refresh token available');
                }

                if (!axiosClientRef) {
                    throw new Error('axiosClientRef is not registered in interceptors');
                }

                // Call refresh-token endpoint with skipAuth and skipLoader
                refreshPromise = axiosClientRef.post(
                    `/Authentication/refresh-token?refreshToken=${encodeURIComponent(rToken)}`,
                    null,
                    { skipAuth: true, skipLoader: true }
                ).then(res => {
                    const data = res.data?.data !== undefined ? res.data.data : res.data;
                    return data;
                });
            }

            const data = await refreshPromise;

            // Prevent race condition if user logged out while refresh token call was pending
            if (!getRefreshToken()) {
                throw new Error('Session expired or logged out during token refresh');
            }

            if (!data || !(data.Token || data.token)) {
                throw new Error('Invalid or empty refresh response DTO structure');
            }

            // Save refreshed tokens
            setAuthData(data);

            // Clear the shared refresh promise for future requests
            refreshPromise = null;

            // Update authorization header of original request
            const newToken = data.Token || data.token;
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

            // Retry the original request
            try {
                const response = await axiosClientRef(originalRequest);
                // Retried request completed successfully. We must call hideLoaderCallback()
                // manually to balance the loader count since we skipped it for the initial 401.
                if (hideLoaderCallback && !originalRequest.skipLoader) {
                    hideLoaderCallback();
                }
                return response;
            } catch (retryError) {
                // Retried request failed. We must call hideLoaderCallback() manually
                // to balance the loader count since we skipped it for the initial 401.
                if (hideLoaderCallback && !originalRequest.skipLoader) {
                    hideLoaderCallback();
                }
                throw retryError;
            }

        } catch (refreshError) {
            // Refresh failed (expired/revoked refresh token, server error, or network failure)
            refreshPromise = null;

            // Balance the loader count for the initial 401 request that we skipped hiding
            if (hideLoaderCallback && !originalRequest.skipLoader) {
                hideLoaderCallback();
            }

            // Clear credentials and trigger logout / redirection to login
            clearAuthData();
            if (onUnauthorizedCallback) {
                onUnauthorizedCallback();
            }

            return Promise.reject(normalizeError(refreshError));
        }
    }

    // Handle normal 401 failures for non-auth routes where refresh is not possible or failed
    if (isUnauthorized && originalRequest && !isPublicOrAuthEndpoint(originalRequest)) {
        clearAuthData();
        if (onUnauthorizedCallback) {
            onUnauthorizedCallback();
        }
    }

    return Promise.reject(normalizeError(error));
};
