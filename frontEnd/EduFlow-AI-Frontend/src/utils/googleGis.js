let scriptLoadingPromise = null;
let isInitialized = false;

/**
 * Dynamically loads the Google Identity Services client script and initializes it.
 * Ensures the script is only loaded once and not duplicated.
 * @returns {Promise<Object>} Promise resolving to the window.google object
 */
export const loadAndInitGoogleGis = () => {
    if (scriptLoadingPromise) {
        return scriptLoadingPromise;
    }

    scriptLoadingPromise = new Promise((resolve, reject) => {
        // If already loaded in window
        if (window.google && window.google.accounts) {
            try {
                initializeGis();
                resolve(window.google);
            } catch (error) {
                reject(error);
            }
            return;
        }

        const scriptId = 'google-gis-client';
        let script = document.getElementById(scriptId);

        if (!script) {
            script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.id = scriptId;
            script.async = true;
            script.defer = true;
            script.onload = () => {
                try {
                    initializeGis();
                    resolve(window.google);
                } catch (error) {
                    reject(error);
                }
            };
            script.onerror = () => {
                reject(new Error('Failed to load Google Identity Services script.'));
            };
            document.head.appendChild(script);
        } else {
            // Script exists but might not be fully loaded
            const interval = setInterval(() => {
                if (window.google && window.google.accounts) {
                    clearInterval(interval);
                    try {
                        initializeGis();
                        resolve(window.google);
                    } catch (error) {
                        reject(error);
                    }
                }
            }, 100);

            setTimeout(() => {
                clearInterval(interval);
                if (!window.google || !window.google.accounts) {
                    reject(new Error('Google Identity Services script load timeout.'));
                }
            }, 10000);
        }
    });

    return scriptLoadingPromise;
};

/**
 * Initializes the Google Identity Services client setup once.
 */
const initializeGis = () => {
    if (isInitialized) return;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
        throw new Error('Google Client ID is missing. Please define VITE_GOOGLE_CLIENT_ID in your environment configuration.');
    }

    window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
            if (window.handleGoogleCredentialResponse) {
                window.handleGoogleCredentialResponse(response);
            }
        }
    });

    isInitialized = true;
};
