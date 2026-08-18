const ACCESS_TOKEN_KEY = 'eduflow_access_token';
const USER_KEY = 'eduflow_user';

/**
 * Stores authentication details (tokens and user info) in local storage.
 * @param {Object} authData - Object containing Token, RefreshToken, and UserData
 */
export const setAuthData = (authData) => {
    if (!authData) return;

    const token = authData.Token || authData.token || authData.accessToken;
    const userData = authData.UserData || authData.userData;

    if (token) {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
    if (userData) {
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
    }
};

/**
 * Gets the stored access token.
 * @returns {string|null} The access token or null
 */
export const getAccessToken = () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};



/**
 * Gets the stored user data.
 * @returns {Object|null} The user object or null
 */
export const getUserData = () => {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch (e) {
        return null;
    }
};

/**
 * Clears all authentication storage data.
 */
export const clearAuthData = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

/**
 * Check if the user is considered authenticated (has access token).
 * @returns {boolean} True if access token exists
 */
export const hasAuthData = () => {
    return !!getAccessToken();
};
