/**
 * Reusable normalized error class representing API failures.
 */
export class ApiError extends Error {
    constructor(message, status = null, errors = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.errors = errors; // Validation or field-specific errors
    }
}

/**
 * Normalizes an Axios error or any caught error into a standardized ApiError.
 * @param {Error} error - The caught error object
 * @returns {ApiError} The normalized ApiError
 */
export const normalizeError = (error) => {
    // If it is already an ApiError, return as-is
    if (error instanceof ApiError) {
        return error;
    }

    let message = 'An unexpected error occurred. Please try again.';
    let status = null;
    let errors = null;

    if (error && error.isAxiosError) {
        if (error.response) {
            // Server responded with a status other than 2xx
            status = error.response.status;
            const data = error.response.data;

            if (data) {
                // Determine potential message fields from the .NET backend wrappers
                // Common keys: message, Message, title, error, Error
                message = data.message || data.Message || data.title || data.error || message;

                // Handle nested errors or validations (e.g. ASP.NET ModelState validation errors)
                // Common keys: errors, Errors
                errors = data.errors || data.Errors || null;
            }
        } else if (error.request) {
            // Request was made but no response was received (Network error)
            message = 'Unable to connect to the server. Please try again.';
            status = 0;
        } else {
            // Something happened in setting up the request that triggered an Error
            message = error.message || message;
        }
    } else if (error && error.message) {
        // Normal JavaScript Error
        message = error.message;
    }

    return new ApiError(message, status, errors);
};
