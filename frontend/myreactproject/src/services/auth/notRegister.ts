// services/auth/notRegister.ts

import axios from 'axios';

const API_URL = 'http://localhost:8000/api/register/'; // Ваш Django API для реєстрації

// Функція для реєстрації користувача
const registerUser = async (email: string, password: string) => {
    try {
        const response = await axios.post(API_URL, {
            email,
            password,
        });
        return response.data; // Повертає повідомлення про успішну реєстрацію або помилку
    } catch (error: any) {
        if (error.response) {
            // Помилка від сервера
            throw new Error(error.response.data.error || 'Something went wrong!');
        } else {
            // Помилка на рівні клієнта
            throw new Error('Network error, please try again later.');
        }
    }
};

export default registerUser;
