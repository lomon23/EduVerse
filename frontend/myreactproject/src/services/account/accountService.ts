const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface AccountDetails {
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    xp: number;
    completed_courses: string[];
    avatar?: string;
    description?: string;
}


export const fetchAccountDetails = async (): Promise<AccountDetails> => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
        throw new Error("Email не знайдено");
    }

    const response = await fetch(`${API_BASE_URL}/account/details/`, {
        headers: {
            'Content-Type': 'application/json',
            'Email': email
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Не вдалося отримати дані акаунту");
    }

    return await response.json();
};

export const updateAccountDetails = async (details: Partial<AccountDetails>): Promise<void> => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
        throw new Error("Email не знайдено");
    }

    const response = await fetch(`${API_BASE_URL}/account/details/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Email': email
        },
        body: JSON.stringify(details)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Не вдалося оновити профіль");
    }
};

export const uploadAvatar = async (base64Image: string): Promise<void> => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
        throw new Error("Email не знайдено");
    }

    const response = await fetch(`${API_BASE_URL}/account/details/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Email': email
        },
        body: JSON.stringify({ avatar: base64Image })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Не вдалося завантажити аватар");
    }
};