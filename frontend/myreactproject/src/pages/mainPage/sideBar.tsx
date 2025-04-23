import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './stylesMP/SideBar.css';
    import { Modal, Box, TextField, Checkbox, FormControlLabel, Button } from '@mui/material';

interface SidebarProps {
    onSelect: (page: string) => void;
    isOpen: boolean;
}

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const Sidebar: React.FC<SidebarProps> = ({ onSelect, isOpen }) => {
    const [activePage, setActivePage] = useState('home');
    const [createRoomOpen, setCreateRoomOpen] = useState(false);
    const [joinRoomOpen, setJoinRoomOpen] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [roomCode, setRoomCode] = useState('');
    const navigate = useNavigate();

    const handleClick = (page: string) => {
        setActivePage(page);
        onSelect(page);
    };

    const handleCreateRoom = () => {
        // Handle room creation logic here
        console.log('Creating room:', { roomName, isPrivate });
        setCreateRoomOpen(false);
    };

    const handleJoinRoom = () => {
        // Handle room joining logic here
        console.log('Joining room with code:', roomCode);
        setJoinRoomOpen(false);
    };

    return (
        <>
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
                    <button
                        className={`sidebar-button ${activePage === 'testing' ? 'active' : ''}`}
                        onClick={() => {
                            setActivePage('testing');
                            navigate('/chat');
                        }}
                    >
                        🧪 Тестування
                    </button>
                    <button
                        className="sidebar-button"
                        onClick={() => setCreateRoomOpen(true)}
                    >
                        ➕ Створити кімнату
                    </button>
                    <button
                        className="sidebar-button"
                        onClick={() => setJoinRoomOpen(true)}
                    >
                        🔗 Приєднатися до кімнати
                    </button>
                </nav>
            </div>

            {/* Create Room Modal */}
            <Modal
                open={createRoomOpen}
                onClose={() => setCreateRoomOpen(false)}
            >
                <Box sx={modalStyle}>
                    <h2>Створити нову кімнату</h2>
                    <TextField
                        fullWidth
                        label="Назва кімнати"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        margin="normal"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isPrivate}
                                onChange={(e) => setIsPrivate(e.target.checked)}
                            />
                        }
                        label="Приватна кімната"
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleCreateRoom}
                        sx={{ mt: 2 }}
                    >
                        Створити
                    </Button>
                </Box>
            </Modal>

            {/* Join Room Modal */}
            <Modal
                open={joinRoomOpen}
                onClose={() => setJoinRoomOpen(false)}
            >
                <Box sx={modalStyle}>
                    <h2>Приєднатися до кімнати</h2>
                    <TextField
                        fullWidth
                        label="Код кімнати"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                        margin="normal"
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleJoinRoom}
                        sx={{ mt: 2 }}
                    >
                        Приєднатися
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default Sidebar;