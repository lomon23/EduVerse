import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './stylesMP/Header.css';

interface HeaderProps {
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        setIsLoggedIn(!!storedEmail);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userEmail');
        setIsLoggedIn(false);
    };

    return (
        <header className="header">
            <div className="header-content">
                <div className="left-section">
                    <button className="menu-toggle" onClick={toggleSidebar}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <div className="logo">
                        <Link to="/">EduPortal</Link>
                    </div>
                    <nav className="left-nav">
                        <Link to="#" className="nav-link">About me</Link>
                        <Link to="#" className="nav-link">Contact</Link>
                    </nav>
                </div>
                <div className="right-section">
                    <nav className="right-nav">
                        {isLoggedIn ? (
                            <>
                                <Link to="/create_course" className="nav-link">Create Course</Link>
                                <Link to="/CreateRoom" className="nav-link"> Create room</Link>
                                <Link to="/account" className="nav-link">Account</Link>
                                <button onClick={handleLogout} className="logout-btn">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/register" className="nav-link">Register</Link>
                                <Link to="/login" className="nav-link">Log in</Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
