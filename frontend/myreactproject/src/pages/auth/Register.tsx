import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import registerUser from '../../services/auth/notRegister'; // Нативна реєстрація

const GoogleRegister: React.FC = () => {
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
                    "http://localhost:8000/api/google-register/",
                    { token: response.access_token },
                    {
                        withCredentials: true,
                        headers: {
                            "X-CSRFToken": csrfToken,
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (res.data.message) {
                    setMessage(`Успішна реєстрація через Google!`);
                    localStorage.setItem("user", JSON.stringify(res.data));
                    navigate('/login');
                }
            } catch (error: any) {
                setMessage(error.response?.data?.error || "Помилка реєстрації через Google");
            }
        },
        onError: () => {
            setMessage("Помилка входу через Google");
        }
    });

    // Нативна реєстрація
    const handleRegister = async () => {
        try {
            const data = await registerUser(email, password);
            console.log('User registered:', data);
            navigate('/login');
        } catch (error) {
            setMessage("Помилка реєстрації");
        }
    };

    return (
        <div>
            <h2>Реєстрація</h2>

            {message && <p>{message}</p>}

            {/* Google */}
            <button onClick={() => googleLogin()}>Зареєструватися через Google</button>

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
            <button onClick={handleRegister}>Реєстрація</button>
        </div>
    );
};

export default GoogleRegister;
