import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        setIsLoggedIn(!!storedEmail); // Якщо email є в localStorage → значить, користувач залогінений
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userEmail'); // Видаляємо email з localStorage
        setIsLoggedIn(false);
    };

    return (
        <header>
            <h1>My Application</h1>
            <nav>
                <Link to="#">About me</Link>
                <Link to="#">Contact</Link>

                {isLoggedIn ? (
                    <>
                        <Link to="/account">Account</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/register">Register</Link>
                        <Link to="/login">Log in</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
