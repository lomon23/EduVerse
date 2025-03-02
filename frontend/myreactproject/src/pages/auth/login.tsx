import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import loginUser from '../../services/auth/notLogin'; // Нативна функція для логінації

const GoogleLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [csrfToken, setCsrfToken] = useState('');
    const navigate = useNavigate();

    // Отримання CSRF-токена
    useEffect(() => {
        axios.get("http://localhost:8000/api/get-csrf-token/", { withCredentials: true })
            .then(res => setCsrfToken(res.data.csrfToken))
            .catch(err => console.error("CSRF error", err));
    }, []);

    // Google Login
    const googleLogin = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                const res = await axios.post(
                    "http://localhost:8000/api/google-login/",  // API для логінації через Google
                    { 
                        token: response.access_token,
                        redirect_uri: window.location.origin // Add this line
                    },
                    {
                        withCredentials: true,
                        headers: {
                            "X-CSRFToken": csrfToken,
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (res.data.message) {
                    setMessage(`Успішний логін через Google!`);
                    localStorage.setItem("userEmail", res.data.email); // зберігаємо email у localStorage
                    navigate('/');
                }
            } catch (error: any) {
                console.error('Google login error:', error);
                setMessage(error.response?.data?.error || "Помилка логіну через Google");
            }
        },
        onError: (error) => {
            console.error('Google login error:', error);
            setMessage("Помилка входу через Google");
        },
        flow: 'implicit' // Add this line
    });

    // Логін через email
    const handleLogin = async () => {
        try {
            const data = await loginUser(email, password);
            console.log('User logged in:', data);
            localStorage.setItem("userEmail", email); // зберігаємо email у localStorage
            navigate('/');
        } catch (error) {
            setMessage("Помилка логіну");
        }
    };

    return (
        <div>
            <h2>Логін</h2>

            {message && <p>{message}</p>}

            {/* Google Login Button */}
            <button onClick={() => googleLogin()}>Увійти через Google</button>

            <h3>Або через email</h3>
            <input
                type="email"
                placeholder="Введіть email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Введіть пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Логін</button>
        </div>
    );
};

export default GoogleLogin;
