export const getApiBaseUrl = () => {
    const configured = import.meta.env.VITE_API_BASE_URL?.trim();
    if (configured) {
        return configured.replace(/\/$/, '');
    }

    if (import.meta.env.DEV) {
        return 'http://localhost:3001';
    }

    return 'https://api.factoresearch.com';
};
