import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Account: React.FC = () => {
    const [email, setEmail] = useState<string | null>(null);
    const [firstName, setFirstName] = useState<string | null>(null);
    const [lastName, setLastName] = useState<string | null>(null);
    const [dateOfBirth, setDateOfBirth] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Завантажуємо дані з localStorage
        const storedEmail = localStorage.getItem('userEmail');
        const storedFirstName = localStorage.getItem('firstName'); // без 'user' приписки
        const storedLastName = localStorage.getItem('lastName');
        const storedDateOfBirth = localStorage.getItem('dateOfBirth');

        if (storedEmail) setEmail(storedEmail);
        if (storedFirstName) setFirstName(storedFirstName);
        if (storedLastName) setLastName(storedLastName);
        if (storedDateOfBirth) setDateOfBirth(storedDateOfBirth);
    }, []);

    return (
        <div>
            <h1>Account Page</h1>
            {email ? (
                <div>
                    <p>Your email: {email}</p>
                    <p>Your first name: {firstName}</p>
                    <p>Your last name: {lastName}</p>
                    <p>Your date of birth: {dateOfBirth}</p>
                </div>
            ) : (
                <button onClick={() => navigate('/login')}>Login</button>
            )}
        </div>
    );
};

export default Account;
