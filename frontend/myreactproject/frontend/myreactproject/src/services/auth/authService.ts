const API_URL = 'http://localhost:8000/api/';
const csrfToken = getCSRFToken();
// Функція для отримання CSRF токену з cookies
function getCSRFToken(): string | null {
    const name = 'csrftoken';
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()!.split(';').shift() || null;
    }
    return null;
}

interface AuthService {
    googleRegister: (token: string) => Promise<any>;
}

const authService: AuthService = {
    googleRegister: async (token: string) => {
        try {
            // Отримуємо CSRF токен з cookie

            
            const response = await fetch(`${API_URL}/google-register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ token, csrfmiddlewaretoken: csrfToken }),
                credentials: 'include',
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
};

export default authService;
