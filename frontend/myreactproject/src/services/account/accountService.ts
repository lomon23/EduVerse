const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface Course {
    _id: string;
    title: string;
    description: string;
    author_email: string;
    created_at: string;
}

export interface AccountDetails {
    email: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    description?: string;
    avatar?: string;
    xp: number;
    completed_courses: Course[];
    courses: Course[]; // Add this line to include user's created courses
}

export interface RoomMember {
    email: string;
    role: string;
    joinedAt: string;
}

export const fetchAccountDetails = async (): Promise<AccountDetails> => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
        throw new Error("Email не знайдено");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/account/details/`, {
            headers: {
                'Content-Type': 'application/json',
                'Email': email
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch account details");
        }

        const data = await response.json();
        console.log('Raw API response:', data);
        console.log('Completed courses:', data.completed_courses);
        
        return data;
    } catch (error) {
        console.error('Error fetching account details:', error);
        throw error;
    }
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