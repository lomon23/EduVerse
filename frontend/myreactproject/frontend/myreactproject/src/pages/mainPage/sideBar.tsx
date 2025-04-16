import React, { useState } from "react";
import './stylesMP/SideBar.css';

interface SidebarProps {
    onSelect: (page: string) => void;
    isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect, isOpen }) => {
    const [activePage, setActivePage] = useState('home');

    const handleClick = (page: string) => {
        setActivePage(page);
        onSelect(page);
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <h2 className="sidebar-title">Меню</h2>
            <nav className="sidebar-nav">
                <button
                    className={`sidebar-button ${activePage === 'home' ? 'active' : ''}`}
                    onClick={() => handleClick('home')}
                >
                    🏠 Головна
                </button>
                <button
                    className={`sidebar-button ${activePage === 'courses' ? 'active' : ''}`}
                    onClick={() => handleClick('courses')}
                >
                    📚 Курси
                </button>
            </nav>
        </div>
    );
};

export default Sidebar;