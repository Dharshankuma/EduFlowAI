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
        `/Authentication/verify-email?token=${encodeURIComponent(token)}`,
        null,
        { skipAuth: true }
    );
    return response;
};

/**
 * Sends a refresh token request to the backend.
 * @returns {Promise<Object>} The new token payload (Token, UserData)
 */
export const refreshToken = async () => {
    const response = await axiosClient.post(
        '/Authentication/refresh-token',
        null,
        { skipAuth: true, skipLoader: true }
    );

    if (response && response.data) {
        if (response.data.data !== undefined) {
            return response.data.data;
        }
        return response.data;
    }

    throw new Error('Invalid response received from the server.');
};

/**
 * Sends a logout request to the backend.
 */
export const logout = async () => {
    await axiosClient.post(
        '/Authentication/logout',
        null,
        { skipAuth: true, skipLoader: true }
    );
};

export const forgetPassword = async (email) => {
    const response = await axiosClient.post(
        `/Authentication/forget-password?email=${encodeURIComponent(email)}`,
        null,
        { skipAuth: true }
    );
    return response;
};

// Alias forgotPassword for ease of import
export const forgotPassword = forgetPassword;

/**
 * Sends a password reset payload to update user password.
 * The backend expects request properties: Token, NewPassword, ConfirmPassword.
 * @param {Object} payload - The reset details containing Token, NewPassword, ConfirmPassword
 */
export const changePassword = async (payload) => {
    const requestBody = {
        Token: payload.Token || payload.token,
        NewPassword: payload.NewPassword || payload.newPassword,
        ConfirmPassword: payload.ConfirmPassword || payload.confirmPassword
    };

    const response = await axiosClient.post(
        '/Authentication/change-password',
        requestBody,
        { skipAuth: true }
    );
    return response;
};
