import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Account: React.FC = () => {
    const [email, setEmail] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    return (
        <div>
            <h1>Account Page</h1>
            {email ? (
                <p>Your email: {email}</p>
            ) : (
                <button onClick={() => navigate('/login')}>Login</button>
            )}
        </div>
    );
};

export default Account;
