import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './stylesMP/SideBar.css';

interface SidebarProps {
    onSelect: (page: string) => void;
    isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect, isOpen }) => {
    const [activePage, setActivePage] = useState('home');
    const [showRoomDropdown, setShowRoomDropdown] = useState(false);
    const navigate = useNavigate();

    const handleClick = (page: string) => {
        setActivePage(page);
        onSelect(page);
    };

    const toggleRoomDropdown = () => {
        setShowRoomDropdown(!showRoomDropdown);
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
                
                {/* Room dropdown button */}
                <div className="dropdown-container">
                    <button
                        className={`sidebar-button ${activePage.startsWith('room') ? 'active' : ''}`}
                        onClick={toggleRoomDropdown}
                    >
                        🚪 Кімната {showRoomDropdown ? '▲' : '▼'}
                    </button>
                    
                    {showRoomDropdown && (
                        <div className="dropdown-menu">
                            <button 
                                className={`dropdown-item ${activePage === 'room-chat' ? 'active' : ''}`}
                                onClick={() => {
                                    setActivePage('room-chat');
                                    navigate('/chat');
                                }}
                            >
                                💬 Чат
                            </button>
                            <button 
                                className={`dropdown-item ${activePage === 'room-voice' ? 'active' : ''}`}
                                onClick={() => {
                                    setActivePage('room-voice');
                                    navigate('/Room');
                                }}
                            >
                                🎤 Кімната
                            </button>
                            <button 
                                className={`dropdown-item ${activePage === 'room-board' ? 'active' : ''}`}
                                onClick={() => {
                                    setActivePage('room-board');
                                    navigate('/board');
                                }}
                            >
                                📋 Дошка
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;