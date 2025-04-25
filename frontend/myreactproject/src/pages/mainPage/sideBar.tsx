import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './stylesMP/SideBar.css';
import { Modal, Box, TextField, Checkbox, FormControlLabel, Button } from '@mui/material';
import { createRoom, joinRoom } from '../../services/room/room_api'; // Import the API functions
import axios from 'axios';

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
    const [inviteCode, setInviteCode] = useState('');
    const [error, setError] = useState('');
    const [createdRooms, setCreatedRooms] = useState([]);
    const [joinedRooms, setJoinedRooms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            const email = localStorage.getItem('userEmail'); // Retrieve email from localStorage
            if (!email) {
                setError('Електронна пошта не знайдена. Увійдіть у систему.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8000/api/rooms/', {
                    headers: { Email: email }
                });
                setCreatedRooms(response.data.createdRooms);
                setJoinedRooms(response.data.joinedRooms);
            } catch (err: any) {
                console.error('Failed to fetch rooms:', err);
            }
        };

        fetchRooms();
    }, []);

    const handleClick = (page: string) => {
        setActivePage(page);
        onSelect(page);
    };

    const handleCreateRoom = async () => {
        try {
            if (!roomName) {
                setError('Назва кімнати є обов\'язковою');
                return;
            }

            const email = localStorage.getItem('userEmail'); // Retrieve email from localStorage
            if (!email) {
                setError('Електронна пошта не знайдена. Увійдіть у систему.');
                return;
            }

            const roomData = {
                name: roomName,
                isPrivate,
            };

            const response = await createRoom(roomData, email);
            console.log('Room created:', response);

            // Reset form and close modal
            setRoomName('');
            setIsPrivate(false);
            setError('');
            setCreateRoomOpen(false);

            // Optionally navigate to the created room
            navigate(`/room/${response._id}`);
        } catch (err: any) {
            setError(err.message || 'Не вдалося створити кімнату');
        }
    };

    const handleJoinRoom = async () => {
        try {
            if (!inviteCode) {
                setError('Код кімнати є обов\'язковим');
                return;
            }

            const email = localStorage.getItem('userEmail'); // Retrieve email from localStorage
            if (!email) {
                setError('Електронна пошта не знайдена. Увійдіть у систему.');
                return;
            }

            const roomData = { inviteCode };

            const response = await joinRoom(roomData, email);
            console.log('Joined room:', response);

            // Reset form and close modal
            setInviteCode('');
            setError('');
            setJoinRoomOpen(false);

            // Navigate to the joined room
            navigate(`/room/${response.roomId}`);
        } catch (err: any) {
            setError(err.message || 'Не вдалося приєднатися до кімнати');
        }
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

                    {/* Display Created Rooms */}
                    <h3 className="sidebar-subtitle">Мої кімнати</h3>
                    {createdRooms.map((room: any) => (
                        <button
                            key={room._id}
                            className="sidebar-button"
                            onClick={() => navigate(`/room/${room._id}`)}
                        >
                            {room.name}
                        </button>
                    ))}

                    {/* Display Joined Rooms */}
                    <h3 className="sidebar-subtitle">Кімнати, до яких я приєднався</h3>
                    {joinedRooms.map((room: any) => (
                        <button
                            key={room._id}
                            className="sidebar-button"
                            onClick={() => navigate(`/room/${room._id}`)}
                        >
                            {room.name}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Create Room Modal */}
            <Modal
                open={createRoomOpen}
                onClose={() => setCreateRoomOpen(false)}
            >
                <Box sx={modalStyle}>
                    <h2>Створити нову кімнату</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
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
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <TextField
                        fullWidth
                        label="Код кімнати"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
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