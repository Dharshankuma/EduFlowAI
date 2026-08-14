import axiosClient from '../client/axiosClient';

/**
 * Sends a login request to the backend API.
 * The backend expects request properties: Email, Password.
 * @param {Object} credentials - The login credentials (email, password)
 * @returns {Promise<Object>} The API response payload (Token, RefreshToken, UserData)
 */
export const login = async (credentials) => {
    const payload = {
        Email: credentials.email || credentials.Email,
        Password: credentials.password || credentials.Password
    };

    const response = await axiosClient.post('/Authentication/login', payload);

    // Support standard .NET wrapped success response format: Success(result, message) -> response.data.data
    // Fall back to response.data if there's no data envelope
    if (response && response.data) {
        if (response.data.data !== undefined) {
            return response.data.data;
        }
        return response.data;
    }

    throw new Error('Invalid response received from the server.');
};

/**
 * Sends a Google authentication request to the backend API.
 * The backend expects request property: CredentialId.
 * @param {string} credential - The Google ID token
 * @returns {Promise<Object>} The API response payload (Token, RefreshToken, UserData)
 */
export const googleLogin = async (credential) => {
    const payload = {
        CredentialId: credential
    };

    const response = await axiosClient.post('/Authentication/GoogleLogin', payload);

    if (response && response.data) {
        if (response.data.data !== undefined) {
            return response.data.data;
        }
        return response.data;
    }

    throw new Error('Invalid response received from the server.');
};


/**
 * Sends a registration request to the backend API.
 * The backend expects request properties: Username, EmailId, Password, authProvider.
 * @param {Object} userData - The registration data containing Username, EmailId, Password, and authProvider
 * @returns {Promise<Object>} The API response payload (204 No Content has no body, returns response.data)
 */
export const register = async (userData) => {
    const payload = {
        Username: userData.Username,
        EmailId: userData.EmailId,
        Password: userData.Password,
        authProvider: userData.authProvider
    };

    const response = await axiosClient.post('/Authentication/register', payload);

    if (response && response.data !== undefined) {
        return response.data;
    }
    return null;
};

/**
 * Placeholder for future email verification API integration.
 */
export const verifyEmail = async (token) => {
    const response = await axiosClient.post(
        `/Authenticationverify-email?token=${encodeURIComponent(token)}`
    );
    return response;
};

/**
 * Placeholder for future refresh token API integration.
 */
export const refreshToken = async (token) => {
    // To be implemented in the refresh token phase
    throw new Error('Not implemented yet');
};

/**
 * Placeholder for future logout API integration.
 */
export const logout = async () => {
    // To be implemented in the logout phase
    throw new Error('Not implemented yet');
};

/**
 * Placeholder for future forgot password API integration.
 */
export const forgetPassword = async (email) => {
    // To be implemented in the forgot password phase
    throw new Error('Not implemented yet');
};

/**
 * Placeholder for future change password API integration.
 */
export const changePassword = async (data) => {
    // To be implemented in the change password phase
    throw new Error('Not implemented yet');
};
