import axios from 'axios';

const API_URL = 'http://localhost:8000/api/login/'; // Ваш Django API для логіну

// Функція для логіну користувача
const loginUser = async (email: string, password: string) => {
    try {
        const response = await axios.post(API_URL, {
            email,
            password,
        });
        return response.data; // Повертає повідомлення про успішний логін або помилку
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

export default loginUser;
