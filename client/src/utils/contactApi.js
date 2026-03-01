const getApiBaseUrl = () => {
    const configured = import.meta.env.VITE_API_BASE_URL?.trim();
    if (configured) {
        return configured.replace(/\/$/, '');
    }

    if (import.meta.env.DEV) {
        return 'http://localhost:3001';
    }

    return '';
};

export const submitContactForm = async (payload) => {
    const apiBaseUrl = getApiBaseUrl();

    if (!apiBaseUrl) {
        throw new Error('Missing VITE_API_BASE_URL for contact form submission.');
    }

    const response = await fetch(`${apiBaseUrl}/api/contact`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(result.error || 'Unable to send message right now.');
    }

    return result;
};
