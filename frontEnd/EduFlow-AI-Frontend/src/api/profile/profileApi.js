import axiosClient from '../client/axiosClient';

/**
 * Retrieves the profile information for the authenticated user.
 * The endpoint is authenticated; axiosClient interceptors automatically handle the Bearer token.
 * 
 * @returns {Promise<Object>} The profile data (ProfileResponseDTO)
 */
export const getProfile = async () => {
    const response = await axiosClient.get('/Profile/get-profile');

    // Support standard .NET wrapped success response format: Success(result, message) -> response.data.data
    // Fall back to response.data if there's no data envelope
    console.log(response);
    if (response && response.data) {
        if (response.data.data !== undefined) {
            return response.data.data;
        }
        return response.data;
    }

    throw new Error('Invalid response received from the server.');
};

/**
 * Updates the personal information for the authenticated user.
 * 
 * @param {Object} data - The personal information payload (UserName, FirstName, LastName, UserTimeZone)
 * @returns {Promise<Object>} The API response (HTTP 204 has no body, returns response)
 */
export const updatePersonalInformation = async (data) => {
    const response = await axiosClient.put('/Profile/personal-information', data);
    return response;
};

/**
 * Updates the weekly study availability for the authenticated user.
 * 
 * @param {Object} data - The weekly availability payload (Availability list)
 * @returns {Promise<Object>} The API response (HTTP 204 has no body, returns response)
 */
export const updateWeeklyAvailability = async (data) => {
    const response = await axiosClient.put('/Profile/weekly-availability', data);
    return response;
};

