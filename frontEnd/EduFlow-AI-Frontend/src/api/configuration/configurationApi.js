import axiosClient from '../client/axiosClient';

/**
 * Retrieves the application configuration details (lookup data for Status, Priority, Goal Type).
 * The endpoint is authenticated; axiosClient interceptors automatically handle the Bearer token.
 * 
 * Backend endpoint: GET /api/Configuration/Getconfiguration
 * 
 * @returns {Promise<Object>} The configuration details containing StatusData, PriorityData, GoalTypeData
 */
export const getConfiguration = async () => {
    const response = await axiosClient.get('/Configuration/Getconfiguration');

    // Support standard .NET BaseController wrapped response: Success(result, message) -> response.data.data
    // Fall back to response.data if there's no data envelope
    if (response && response.data) {
        if (response.data.data !== undefined) {
            return response.data.data;
        }
        return response.data;
    }

    throw new Error('Invalid response received from the server.');
};
