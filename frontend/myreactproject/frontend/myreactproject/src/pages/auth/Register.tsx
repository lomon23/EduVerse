import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import registerUser from '../../services/auth/notRegister';
import './StylesAuth/register.css';

const GoogleRegister: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
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
            const data = await registerUser(email, password, firstName, lastName, dateOfBirth);
            console.log('User registered:', data);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('firstName', firstName);
            localStorage.setItem('lastName', lastName);
            localStorage.setItem('dateOfBirth', dateOfBirth);
            navigate('/login');
        } catch (error) {
            setMessage("Помилка реєстрації");
        }
    };

    return (
        <div className="auth-page container">
            <div className="formBox">
                <h2 className="title">Create Account</h2>

                {message && <p className="message">{message}</p>}

                <div className="inputGroup">
                    <input
                        className="input"
                        type="email"
                        id="email"
                        placeholder=" "
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label className="label" htmlFor="email">Email</label>
                </div>

                <div className="inputGroup">
                    <input
                        className="input"
                        type="password"
                        id="password"
                        placeholder=" "
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label className="label" htmlFor="password">Password</label>
                </div>

                <div className="inputGroup">
                    <input
                        className="input"
                        type="text"
                        id="first-name"
                        placeholder=" "
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <label className="label" htmlFor="first-name">First Name</label>
                </div>

                <div className="inputGroup">
                    <input
                        className="input"
                        type="text"
                        id="last-name"
                        placeholder=" "
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    <label className="label" htmlFor="last-name">Last Name</label>
                </div>

                <div className="inputGroup">
                    <input
                        className="input"
                        type="date"
                        id="birth-date"
                        placeholder=" "
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        required
                    />
                    <label className="label" htmlFor="birth-date">Date of Birth</label>
                </div>

                <button className="button" onClick={handleRegister}>
                    Create Account
                </button>

                <div className="divider">or</div>

                <button className="button google-btn" onClick={() => googleLogin()}>
                    Sign up with Google
                </button>

                <p className="login-text">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
    );
};

export default GoogleRegister;
