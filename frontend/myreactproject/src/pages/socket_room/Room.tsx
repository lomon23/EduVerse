import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Container, Grid, Tabs, Tab, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ChatRoom from './ChatRoom'; // Import the ChatRoom component
import { fetchRoomMembers, removeUserFromRoom, RoomMember } from '../../services/room/room_api';
import DeleteIcon from '@mui/icons-material/Delete';

const Room: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>(); // Get roomId from URL params
    const [roomDetails, setRoomDetails] = useState<{
        name: string;
        createdAt: string;
        ownerEmail: string;
    } | null>(null);
    const [members, setMembers] = useState<RoomMember[]>([]); // State for members info
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState(0); // State for active tab

    const currentUserEmail = localStorage.getItem('userEmail');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const email = localStorage.getItem('userEmail'); // Retrieve email from localStorage
                if (!email) {
                    setError('Електронна пошта не знайдена. Увійдіть у систему.');
                    return;
                }

                const roomResponse = await axios.get(`http://localhost:8000/api/rooms/${roomId}/`, {
                    headers: { Email: email },
                });

                setRoomDetails(roomResponse.data);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Не вдалося завантажити дані');
            }
        };

        fetchData();
    }, [roomId]);

    useEffect(() => {
        const fetchMembers = async () => {
            if (!roomId) return;
            try {
                const data = await fetchRoomMembers(roomId);
                setMembers(data);
            } catch (e) {}
        };
        fetchMembers();
    }, [roomId]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleRemoveMember = async (email: string) => {
        if (!roomId) return;
        try {
            await removeUserFromRoom({ roomId, email });
            setMembers((prevMembers) => prevMembers.filter((member) => member.email !== email));
        } catch (err) {
            console.error('Failed to remove member:', err);
        }
    };

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    if (!roomDetails) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography>Завантаження даних кімнати...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Grid container spacing={3}>
                {/* Tabs Section */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            centered
                        >
                            <Tab label="Main Page" />
                            <Tab label="Chat" />
                            <Tab label="Board" />
                            <Tab label="Voice Chat" />
                        </Tabs>
                    </Paper>
                </Grid>

                {/* Tab Content */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        {activeTab === 0 && (
                            <>
                                <Typography variant="h4" sx={{ mb: 2 }}>
                                    {roomDetails.name}
                                </Typography>
                                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                                    Список учасників кімнати:
                                </Typography>
                                <List sx={{ mb: 2 }}>
                                    {members.map((member, idx) => (
                                        <ListItem
                                            key={member.email + idx}
                                            divider
                                            secondaryAction={
                                                roomDetails.ownerEmail === currentUserEmail && (
                                                    <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveMember(member.email)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                )
                                            }
                                        >
                                            <ListItemText
                                                primary={member.email}
                                                secondary={`Роль: ${member.role} | Приєднався: ${new Date(member.joinedAt).toLocaleString()}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    <strong>Дата створення:</strong> {new Date(roomDetails.createdAt).toLocaleString()}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Автор:</strong> {roomDetails.ownerEmail}
                                </Typography>
                            </>
                        )}
                        
                        {activeTab === 1 && <ChatRoom roomId={roomId!} />} {/* Render ChatRoom component */}
                        {activeTab === 2 && (
                            <Typography variant="body1">
                                Це вкладка дошки. Тут буде реалізовано функціонал дошки.
                            </Typography>
                        )}
                        {activeTab === 3 && (
                            <Typography variant="body1">
                                Це вкладка голосового чату. Тут буде реалізовано функціонал голосового чату.
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Room;